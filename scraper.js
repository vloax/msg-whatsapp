const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")();

async function scrape(url) {
  const nome = prompt("Digite o contato de destino: ");

  if (nome == null) {
    console.log("Nome não pode ser nulo");
    return;
  }

  const mensagem = prompt("Digite sua mensagem: ");

  if (mensagem == null) {
    console.log("Mensagem não pode ser nula");
    return;
  }

  const quantidadeDeMensagens = prompt("Digite a quantidade de mensagens: ");

  if (quantidadeDeMensagens == null || quantidadeDeMensagens <= 0) {
    console.log("Quantidade de mensagens não pode ser nula");
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(`span[title='${nome}']`);
  const target = await page.$(`span[title='${nome}']`);
  if (target) {
    await target.click();
  } else {
    console.error("Elemento não encontrado.");
  }
  const selectorInput = "div._3Uu1_ div[data-lexical-editor='true']";
  await page.waitForSelector(selectorInput, { timeout: 5000 });
  const inputField = await page.$(selectorInput);

  if (inputField) {
    for (let i = 0; i < quantidadeDeMensagens; i++) {
      await inputField.type(`${mensagem}`);
      console.log("Mensagem Digitada!")
      await page.keyboard.press("Enter");
      console.log("Mensagem Enviada!")
    }
  } else {
    console.error("Campo de entrada não encontrado.");
  }
}

scrape("https://web.whatsapp.com");