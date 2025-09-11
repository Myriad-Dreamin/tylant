declare module 'virtual:tylant/user-config' {
    const userConfig: import('./src/types').TylantConfig;
    export default userConfig;
}

declare module 'virtual:tylant/components/ThemeProvider' {
    const ThemeProvider: typeof import('./src/components/ThemeProvider.astro').default;
    export default ThemeProvider;
}
declare module 'virtual:tylant/components/ThemeToggle' {
    const ThemeToggle: typeof import('./src/components/ThemeToggle.astro').default;
    export default ThemeToggle;
}
declare module 'virtual:tylant/components/TagList' {
    const TagList: typeof import('./src/components/TagList.astro').default;
    export default TagList;
}
declare module 'virtual:tylant/components/PostClick' {
    const PostClick: typeof import('./src/components/PostClick.astro').default;
    export default PostClick;
}
declare module 'virtual:tylant/components/LikeReaction' {
    const LikeReaction: typeof import('./src/components/LikeReaction.astro').default;
    export default LikeReaction;
}
declare module 'virtual:tylant/components/Search' {
    const Search: typeof import('./src/components/Search.astro').default;
    export default Search;
}
declare module 'virtual:tylant/components/CommentList' {
    const CommentList: typeof import('./src/components/CommentList.astro').default;
    export default CommentList;
}
declare module 'virtual:tylant/components/RecentComment' {
    const RecentComment: typeof import('./src/components/RecentComment.astro').default;
    export default RecentComment;
}
declare module 'virtual:tylant/components/ArchiveList' {
    const ArchiveList: typeof import('./src/components/ArchiveList.astro').default;
    export default ArchiveList;
}
declare module 'virtual:tylant/components/ArchiveButton' {
    const ArchiveButton: typeof import('./src/components/ArchiveButton.astro').default;
    export default ArchiveButton;
}
declare module 'virtual:tylant/components/ArchiveRef' {
    const ArchiveRef: typeof import('./src/components/ArchiveRef.astro').default;
    export default ArchiveRef;
}

declare module 'virtual:tylant/components/minimal/BaseHead' {
    const BaseHead: typeof import('./src/components/minimal/BaseHead.astro').default;
    export default BaseHead;
}
declare module 'virtual:tylant/components/minimal/Footer' {
    const Footer: typeof import('./src/components/minimal/Footer.astro').default;
    export default Footer;
}
declare module 'virtual:tylant/components/minimal/FormattedDate' {
    const FormattedDate: typeof import('./src/components/minimal/FormattedDate.astro').default;
    export default FormattedDate;
}
declare module 'virtual:tylant/components/minimal/Header' {
    const Header: typeof import('./src/components/minimal/Header.astro').default;
    export default Header;
}