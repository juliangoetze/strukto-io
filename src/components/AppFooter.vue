<template>
  <div class="footer-container">
    <div />
    <a href="https://github.com/juliangoetze/strukto-io" target="_blank" class="footer-item"
      ><img src="../assets/icons/github.svg" class="footer-link-image" />strukto-io</a
    >
  </div>
</template>

<style scoped>
.footer-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: flex-end;
  gap: 2rem;
}
.footer-item {
  font-size: var(--fs-footer-nav);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.5ch;
  justify-self: center;
}
.footer-link-image {
  height: 1.5rem;
  width: 1.5rem;
}
.feedback {
  justify-self: flex-end;
}
</style>
