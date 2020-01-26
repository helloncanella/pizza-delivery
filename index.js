const StringDecoder = require("string_decoder").StringDecoder;
const http = require("http");
const url = require("url");
const config = require("./config");
const parseJSON = require("./helpers/parseJSON");

const server = http.createServer((req, res) => {
  const decoder = new StringDecoder("utf-8");

  let buffer = "";

  req.on("data", data => {
    console.log("req.on.data", data, decoder.write(data));
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    const decoderEnd = decoder.end();
    console.log("req.on.end", decoderEnd);
    buffer += decoderEnd();

    const parsedUrl = url.parse(req.url, true);

    const data = {
      queryStringObject: parsedUrl.query,
      method: req.method.toLocaleLowerCase(),
      headers: req.headers,
      payload: parseJSON(buffer),
      trimmedPath: (() => {
        const path = parsedUrl.pathname;
        const trimmedPath = path.replace(/^\/+|\/+$/g, "");

        return trimmedPath;
      })()
    };

    const chosenHandler =
      typeof router[data.trimmedPath] === "function"
        ? router[data.trimmedPath]
        : router.notFound;

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    });
  });
});

server.listen(config.port, () =>
  console.log("server available on port " + config.port)
);
