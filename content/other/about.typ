
#import "/typ/templates/mod.typ": sys-is-html-target

// If the site is not bundled my artwork, don't show it
#let show-artwork = true
#let is-external = state("about:is-external", false)

#let en = text.with(lang: "en")
#let zh = text.with(lang: "zh")

#let blog-desc = [
  #en[
    Myriad Dreamin puts down notes, essays, and articles within _PoeMagie._
  ]

  #zh[
    _PoeMagie_ 中记录了 Myriad Dreamin 的日常与随笔。
  ]
]

#let self-desc = [
  #context if not is-external.get() { blog-desc }

  #en[
    I'm a student. I make compilers and software in my spare time. I have a fictional character named raihamiya.
  ]

  #zh[
    我是一名学生。我在空余时间开发编译器和软件。我拥有一个名为「礼羽みや」的虚构角色。
  ]

  #link("https://github.com/Myriad-Dreamin")[GitHub]/#link("https://skeb.jp/@camiyoru")[Skeb]. Buy me a coffee on #link("https://app.unifans.io/c/camiyoru")[Unifans]/#link("https://afdian.com/a/camiyoru")[Afdian].
]

#if sys-is-html-target and show-artwork {
  {
    show raw: it => html.elem("style", it.text)
    ```css
    .self-desc .thumbnail-container {
      flex: 0 0 22em;
      border-radius: 0.5em;
      overflow: hidden;
      margin-left: 2em;
      margin-block-start: -1em;
      margin-block-end: 2em;
    }

    .self-desc .thumbnail-container,
    .self-desc .thumbnail {
      float: right;
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
        display: flex;
        gap: 1em;
        flex-direction: column-reverse;
        align-items: center;
      }
      .self-desc .thumbnail-container {
        margin-block-start: 0em;
        margin-block-end: 0em;
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
            "xlink:href": "/favicon.svg#thumbnail-bg" + str(i),
            style: "fill: var(--thumbnail-bg)",
          ),
        )
      }
      for i in range(fgs) {
        html.elem(
          "use",
          attrs: (
            "xlink:href": "/favicon.svg#thumbnail-fg" + str(i),
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
      div(self-desc)
    },
  )
} else {
  self-desc
}

#context if is-external.get() {
  show "PoeMagie": link.with("https://www.myriad-dreamin.com")

  [= My Blog]

  blog-desc
} else {
  [= Regional Mirror]
}

#en[
  If you are in the Asia region, such as China and Japanese, you can access the regional mirror at #link("https://cn.myriad-dreamin.com")[PoeMagie.]
]

#zh[
  如果你在亚洲地区（例如中国或日本），可以访问 #link("https://cn.myriad-dreamin.com")[PoeMagie] 的亚洲地区镜像。
]
