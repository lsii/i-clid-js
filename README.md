# i-clid-js

### Installing
```html
<script src="https://cdn.jsdelivr.net/gh/lsii/i-clid-js@main/dist/iclid.js"></script>
```

### Getting started
```html
<script>
window.addEventListener("load", function () {
  window.iClid({
    selector: "article",
    ignoreKeys: [
      "not_required_param_1",
      "not_required_param_2"
    ],
    mode: "replace"
  });
});
</script>
```
