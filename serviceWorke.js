const staticDevCoffee = "dev-coffee-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  "/images/coffee5.jpg",
  "/images/coffee6.jpg",
  "/images/coffee7.jpg",
  "/images/coffee8.jpg",
  "/images/coffee9.jpg",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            cache.addAll(assets)
        })
    )
})

/*
Declaramos o nome do nosso cache staticDevCoffee e os arquivos para salvar no cache. Após fazermos isso, precisamos adicionar um listener ao self.

self é o service worker. Ele nos permite "ouvir" o ciclo de vida dos eventos e fazer alguma coisa quando esses eventos de fato acontecem.

O service worker tem alguns ciclos de vida e um deles é o evento install. Ele é executado quando um service worker é instalado. Ele executa tão logo um worker execute e somente é executado uma vez por service worker.

Quando o evento install é acionado, executamos uma função de retorno (callback), que nos dará acesso ao objeto event.

Armazenar alguma coisa no navegador pode levar algum tempo para terminar, porque é assíncrono.

Então, para lidar com isso, precisamos usar waitUntil() que, como você pode imaginar, vai esperar o carregamento para, então, finalizar.

Uma vez que a API do cache está pronta, podemos executar o método open() e criar nosso cache passando o nome do nosso cache como um argumento, assim: caches.open(staticDevCoffee)

Então, essa função nos retornará uma Promise, que nos ajuda a armazenar nossos arquivos no cache com cache.addAll(assets).

cached-images
Espero que você ainda esteja comigo.

Agora, armazenamos nossos arquivos no navegador com sucesso. E, na próxima vez em que carregarmos a página, o service worker lidará com as requisições e acessará o cache se estivermos off-line.
*/

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})

/*
Aqui, usamos o evento fetch para obter nossos dados. A função de retorno (callback) nos dá acesso ao fetchEvent. Então, acoplamos respondWith() para modificar a resposta padrão do navegador. Em vez disso (da resposta padrão), a função retorna uma promise, já que a ação de acessar os arquivos pode demorar algum tempo para terminar.

Quando o cache estiver pronto, podemos aplicar caches.match(fetchEvent.request). Isso verificará se alguma coisa no cache corresponde a fetchEvent.request. Para que você saiba, fetchEvent.request é apenas um array de arquivos.

Então, a função retorna uma promise. Finalmente, podemos retornar os resultados, se eles existirem, ou fazer o fetch inicial caso não existam resultados a exibir.

Agora, nossos arquivos podem ser armazenados e acessados pelo service worker, o que melhora o tempo de carregamento das nossas imagens um pouco.

E o mais importante: isso faz com que o nosso app fique disponível off-line.

O service worker, porém, não consegue fazer todo o trabalho sozinho. Precisamos registrá-lo em nosso projeto.
*/

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

/*
Aqui, verificamos se o service worker é suportado pelo nosso navegador (ele não é suportado por todos os navegadores).

Então, "ouvimos" o evento de carregamento da página para registrar nosso service worker, passando para ele o nome do arquivo serviceWorker.js para navigator.serviceWorker.register() como parâmetro para registrá-lo.

Com esse ajuste, agora transformamos nosso aplicativo web normal em um PWA.
*/