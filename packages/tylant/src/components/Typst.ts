import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { resolve } from "path";
import { readFile } from "fs/promises";
import sanitizeHtml from "sanitize-html";

const projectRoot = process.cwd();

const compiler = NodeCompiler.create({
  workspace: resolve(projectRoot, "typ/"),
});

const pdfCompiler = NodeCompiler.create({
  workspace: projectRoot,
  fontArgs: [{ fontPaths: [resolve(projectRoot, "assets/fonts/")] }],
});

const mathMlTags = [
  "annotation",
  "annotation-xml",
  "maction",
  "maligngroup",
  "malignmark",
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mi",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mprescripts",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "none",
  "semantics",
];

const mathMlAttributes = [
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "class",
  "close",
  "columnalign",
  "columnlines",
  "columnspan",
  "columnspacing",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "fence",
  "form",
  "frame",
  "framespacing",
  "height",
  "largeop",
  "linethickness",
  "lspace",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspan",
  "rowspacing",
  "rspace",
  "scriptlevel",
  "separator",
  "stretchy",
  "symmetric",
  "width",
];

const mathMlAllowedAttributes = Object.fromEntries(
  mathMlTags.map((tag) => [tag, mathMlAttributes])
);

const sanitizeCommentHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      "a",
      "blockquote",
      "br",
      "code",
      "del",
      "em",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "img",
      "li",
      "ol",
      "p",
      "pre",
      "strong",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "ul",
      ...mathMlTags,
    ],
    allowedAttributes: {
      a: ["href", "title", "class"],
      code: ["class"],
      img: ["src", "alt", "title"],
      td: ["align"],
      th: ["align"],
      ...mathMlAllowedAttributes,
    },
    allowedClasses: {
      a: ["commentref", "userref"],
      code: [/^language-[\w-]+$/],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    parseStyleAttributes: false,
  });

export async function renderMonthlyPdf(mainFilePath: string): Promise<Buffer> {
  return pdfCompiler.pdf({
    mainFilePath: resolve(projectRoot, mainFilePath),
    inputs: {
      "build-kind": "monthly",
    },
  });
}

export async function renderComment(typstCode: string): Promise<string> {
  let maxRawBackticks = 0;
  let matchedBackticks;
  let re = /`{3,}/g;
  while ((matchedBackticks = re.exec(typstCode)) !== null) {
    const backtickCount = matchedBackticks[0].length;
    if (backtickCount > maxRawBackticks) {
      maxRawBackticks = backtickCount;
    }
  }
  const commentTemplate = await readFile(
    resolve(projectRoot, "typ/templates/comment.typ"),
    "utf-8"
  );

  const backtick = "`".repeat(Math.max(maxRawBackticks + 1, 3));
  const mainFileContent = `
${commentTemplate.replace("blog.typ", "templates/blog.typ")}
${backtick}md-render
${typstCode}
${backtick}
`;

  try {
    compiler.evictCache(10);
    const result = compiler.tryHtml({ mainFileContent });
    if (result.hasError()) {
      console.error("Error compiling comment:");
      result.printDiagnostics();
      return "";
    }

    return sanitizeCommentHtml(result.result?.body() || "");
  } catch (error) {
    console.error("Error rendering Typst code:", error);
    return "";
  }
}
