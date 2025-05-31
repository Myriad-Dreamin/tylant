
#import "/typ/templates/mod.typ": sys-is-html-target

#let is-external = state("about:is-external", false)

#let self-desc = [
  Myriad Dreamin puts down daily life, essays, and notes within _PoeMagie._

  Myriad Dreamin 在 _PoeMagie_ 中记录生活中的日常、随笔与笔记。

  I'm a student. I make compilers and software in my spare time. I have a fictional character named raihamiya.

  我是一名学生。我在空余时间开发编译器和软件。我拥有一个名为「礼羽みや」的虚构角色。

  #link("https://github.com/Myriad-Dreamin")[GitHub]/#link("https://skeb.jp/@camiyoru")[Skeb]. Buy me a coffee on #link("https://app.unifans.io/c/camiyoru")[Unifans]/#link("https://afdian.com/a/camiyoru")[Afdian].
]

#if sys-is-html-target {
  {
    show raw: it => html.elem("style", it.text)
    ```css
    .self-desc {
      display: flex;
      flex-direction: row;
      gap: 4em;
      margin-block-start: -1em;
    }

    .self-desc .thumbnail-container {
      flex: 0 0 22em;
      border-radius: 0.5em;
      overflow: hidden;
    }

    .self-desc .thumbnail-container,
    .self-desc .thumbnail {
      width: 22em;
      height: 22em;
    }

    .thumbnail {
      --thumbnail-fg: var(--main-color);
      --thumbnail-bg: transparent;
    }

    .dark .thumbnail {
      --thumbnail-bg: var(--main-color);
      --thumbnail-fg: transparent;
    }

    @media (max-width: 800px) {
      .self-desc {
        flex-direction: column;
        align-items: center;
      }
      .self-desc .thumbnail-container,
      .self-desc .thumbnail {
        width: 100%;
        height: 100%;
      }
    }
    ```
  }

  let div = html.elem.with("div")
  let svg = html.elem.with("svg")

  let artwork = svg(
    attrs: (
      class: "thumbnail",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 640 640",
    ),
    {
      let count-path() = {
        let data = str(read("/public/favicon.svg"))
        let fgs = regex("thumbnail-fg\d+")
        let bgs = regex("thumbnail-bg\d+")
        (data.matches(fgs).len(), data.matches(bgs).len())
      }

      let (fgs, bgs) = count-path()

      for i in range(bgs) {
        html.elem(
          "use",
          attrs: (
            "xlink:href": "/tylant/favicon.svg#thumbnail-bg" + str(i),
            style: "fill: var(--thumbnail-bg)",
          ),
        )
      }
      for i in range(fgs) {
        html.elem(
          "use",
          attrs: (
            "xlink:href": "/tylant/favicon.svg#thumbnail-fg" + str(i),
            style: "fill: var(--thumbnail-fg)",
          ),
        )
      }
    },
  )

  div(
    attrs: (
      class: "self-desc",
    ),
    {
      div(self-desc)
      context div(
        attrs: (
          class: "thumbnail-container link",
          title: "礼羽みや, artwork by ちょみます (@tyomimas)",
          onclick: if is-external.get() {
            "location.href='https://www.myriad-dreamin.com/article/personal-info'"
          } else {
            "location.href='/article/personal-info'"
          },
        ),
        artwork,
      )
    },
  )
} else {
  self-desc
}
