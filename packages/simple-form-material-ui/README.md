To use `reserveSpaceForValidationMessage` in your theme you must add this to your code:

```typescript
declare module "@mui/material/styles" {
  // eslint-disable-next-line @ilbrando/prefer-type
  interface Theme {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }

  // eslint-disable-next-line @ilbrando/prefer-type
  interface ThemeOptions {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }
}```

Then you can use it like this:

```typescript
const theme = extendTheme({
  simpleForm: {
    reserveSpaceForValidationMessage: true
  }
});
```
