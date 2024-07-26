# SIMPLE SWAP UI

A crypto swap ui for trading tokens. 

![swap image](/swapImage.png)

There are two modes

## Dynamic

In this mode, there's all kinds of state handling

1. Input output tokens a loaded  (mocked) with loading skeletons
2. The values get set depending on their price
3. The tokens are cached depending on what the user has recently used
4. Error and success toast depending on the swap transaction (mocked)
5. Buttons that set the input value depending on the user's balance

### Tech Stack
- [Shadcn UI](https://ui.shadcn.com/) for ui and form components
- [Tanstack Query](https://tanstack.com/query/latest) for async state management and mutations
- [Jotai](https://jotai.org/) for local state handling and token caching

## Stateless

In this mode there's no state handling just the ui

## Tech Stack
- [Shadcn UI]('https://ui.shadcn.com/) for ui and form components. 

You can copy this one directly in your project if you have different stack and use your stack with it.

