export function getRecaptchaToken(name: string): Promise<string> {
  const widgetId = window.app.recaptcha[name];

  return new Promise(resolve => {
    if (!window.app.recaptcha.token) {
      grecaptcha.execute(widgetId as number);
    }

    function poll() {
      const token = window.app.recaptcha.token;

      if (token) {
        resolve(token);
      }

      setTimeout(poll, 300);
    }

    poll();
  });
}
