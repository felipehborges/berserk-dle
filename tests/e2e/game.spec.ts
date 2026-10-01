import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const key = 'berserkdle:v1:2026-10-01';
async function boot(page: Page) {
  await page.clock.install({ time: new Date('2026-10-01T15:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('combobox')).toBeEnabled();
}
async function guess(page: Page, name: string) {
  await page.getByRole('combobox').fill(name);
  await page.getByRole('button', { name: 'Arriscar palpite' }).click();
}

test('keyboard alias search, invalid/repeated guesses, win, reload and share fallback', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await boot(page);
  await guess(page, 'unknown');
  await expect(
    page.getByText('Escolha um personagem da lista ou digite o nome completo.'),
  ).toBeVisible();
  await guess(page, 'Gatts');
  await expect(page.getByLabel('1 de 8 tentativas')).toBeVisible();
  await guess(page, 'Guts');
  await expect(
    page.getByText('Você já tentou esse personagem. Escolha outro nome.'),
  ).toBeVisible();
  await page.getByRole('combobox').fill('judô');
  await page.getByRole('combobox').press('ArrowDown');
  await expect(page.getByRole('option', { name: /Judeau/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('combobox').press('Enter');
  await expect(page.getByRole('combobox')).toHaveValue('Judeau');
  await page.getByRole('combobox').press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Você encontrou Judeau.' }),
  ).toBeVisible();
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Você encontrou Judeau.' }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('blocked')) },
    });
  });
  await page.getByRole('button', { name: 'Compartilhar resultado' }).click();
  await expect(page.getByLabel('Resultado para copiar')).toContainText(
    'Personagem 2/8',
  );
  await expect(page.getByLabel('Resultado para copiar')).not.toContainText(
    'Judeau',
  );
  expect(errors).toEqual([]);
});

test('eight wrong guesses reveal answer and permanently stop input for the day', async ({
  page,
}) => {
  await boot(page);
  for (const name of [
    'Guts',
    'Puck',
    'Zodd',
    'Casca',
    'Griffith',
    'Farnese',
    'Serpico',
    'Rickert',
  ])
    await guess(page, name);
  await expect(
    page.getByRole('heading', { name: 'O personagem era Judeau.' }),
  ).toBeVisible();
  await expect(page.getByLabel('8 de 8 tentativas')).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'O personagem era Judeau.' }),
  ).toBeVisible();
  await expect(page.getByRole('combobox')).toHaveCount(0);
});

test('midnight in Brasília resets an open game, independent of browser timezone', async ({
  page,
}) => {
  await boot(page);
  await guess(page, 'Guts');
  await page.clock.setSystemTime(new Date('2026-10-02T02:59:59Z'));
  await page.clock.runFor(500);
  await expect(page.getByLabel('1 de 8 tentativas')).toBeVisible();
  await page.clock.runFor(1500);
  await expect(page.getByLabel('0 de 8 tentativas')).toBeVisible();
  await expect(
    page.getByText('Virou o dia em Brasília. Um novo desafio começou.'),
  ).toBeVisible();
  await guess(page, 'Irvine');
  await expect(
    page.getByRole('heading', { name: 'Você encontrou Irvine.' }),
  ).toBeVisible();
});

test('corrupt local save and denied storage remain playable', async ({
  page,
}) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{invalid'), key);
  await boot(page);
  await expect(page.getByLabel('0 de 8 tentativas')).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('denied');
    };
  });
  await guess(page, 'Guts');
  await expect(
    page.getByText(/O navegador bloqueou o armazenamento/),
  ).toBeVisible();
  await guess(page, 'Judeau');
  await expect(
    page.getByRole('heading', { name: 'Você encontrou Judeau.' }),
  ).toBeVisible();
});

test('responsive layout, dialog focus and accessibility in empty, clue and finished states', async ({
  page,
}, testInfo) => {
  await boot(page);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  let scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-empty.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Como jogar' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Como jogar' })).toBeFocused();
  await guess(page, 'Guts');
  await page.getByRole('combobox').fill('ca');
  await page.getByRole('combobox').press('ArrowDown');
  scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await guess(page, 'Judeau');
  scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-result.png`,
    fullPage: true,
  });
});

test('progress synchronizes across tabs', async ({ page, context }) => {
  await boot(page);
  const second = await context.newPage();
  await boot(second);
  await guess(page, 'Guts');
  await expect(second.getByLabel('1 de 8 tentativas')).toBeVisible();
  await guess(second, 'Judeau');
  await expect(
    page.getByRole('heading', { name: 'Você encontrou Judeau.' }),
  ).toBeVisible();
});

test('pointer selection, narrow viewport, partial reload and clipboard success', async ({
  page,
  isMobile,
}) => {
  await boot(page);
  if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole('combobox').fill('Gatts');
  const option = page.getByRole('option', { name: /Guts/ });
  if (isMobile) await option.tap();
  else await option.click();
  await expect(page.getByRole('combobox')).toHaveValue('Guts');
  const submit = page.getByRole('button', { name: 'Arriscar palpite' });
  if (isMobile) await submit.tap();
  else await submit.click();
  await expect(page.getByLabel('1 de 8 tentativas')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('1 de 8 tentativas')).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await guess(page, 'Judeau');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.body.dataset.copiedResult = text;
        },
      },
    });
  });
  await page.getByRole('button', { name: 'Compartilhar resultado' }).click();
  await expect(page.getByText('Resultado copiado!')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute(
    'data-copied-result',
    /Personagem 2\/8/,
  );
  await expect(page.locator('body')).not.toHaveAttribute(
    'data-copied-result',
    /Judeau/,
  );
});
