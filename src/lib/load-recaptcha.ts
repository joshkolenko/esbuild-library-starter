export function loadRecaptcha(form: { element: HTMLElement; name: string }) {
  const sitekey = '6LfEEdAZAAAAAFkQnHboH4NGsRUUJAwLD4YtXoM2';
  const id = form.name + '-recaptcha';

  const container = document.createElement('div');
  container.classList.add('recaptcha');
  container.style.display = 'none';

  const div = document.createElement('div');
  div.id = id;

  window.app.recaptcha = {};

  const script = document.createElement('script');
  script.innerHTML =
    `function ${form.name}OnSubmit(token) {` +
    `window.app.recaptcha.token = token;` +
    `};` +
    `` +
    `function ${form.name}OnLoad() {` +
    `const widgetId = grecaptcha.render('${id}', {` +
    `sitekey: '${sitekey}',` +
    `callback: ${form.name}OnSubmit,` +
    `size: 'invisible'` +
    `});` +
    `` +
    `window.app.recaptcha.${form.name} = widgetId;` +
    `};`;

  const api = document.createElement('script');
  api.src = `https://www.google.com/recaptcha/api.js?onload=${form.name}OnLoad&render=explicit`;
  api.async = true;
  api.defer = true;

  container.append(div, script, api);
  form.element.append(container);
}
