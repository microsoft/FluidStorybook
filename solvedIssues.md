# Error Loading MDX: Cannot read property 'path' of undefined

The `@mdx-js` version has a breaking change (should be short-term).

https://github.com/mdx-js/mdx/issues/1153

## Modifying output to be used in Hugo

.storybook/main.js webpack entrypoint is for the preview, not for the manager

manager = broader UI
preview = inner guy