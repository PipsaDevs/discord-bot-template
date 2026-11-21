# discord-bot-template, una plantilla lista para usar

## Instalador

Puedes reutilizar la plantilla o descargar el instalador directamente.

### Refrescar una copia existente

Desde la raíz de un clon o de un repositorio creado con la plantilla:

```sh
./install.sh
```

El instalador conserva los scripts, el código fuente y los remotos existentes.
Elimina `package.json`, `pnpm-lock.yaml` y `node_modules`, vuelve a resolver
todas las dependencias sin versiones antiguas y genera un lockfile nuevo.

### Descargar e instalar en una carpeta nueva

```sh
curl -fsSL https://raw.githubusercontent.com/PipsaDevs/discord-bot-template/main/install.sh | bash -s -- --directory mi-bot
```

Sin `--directory`, el script pregunta por el nombre de la carpeta. También puede
configurar el remoto inmediatamente:

```sh
curl -fsSL https://raw.githubusercontent.com/PipsaDevs/discord-bot-template/main/install.sh | bash -s -- --directory mi-bot --remote git@github.com:usuario/mi-bot.git
```

## Como empezar a desarrollar

1. Requisitos previos
   Para poder trabajar con esta plantilla, necesitas:

- Node.js versión LTS
- Un ordenador con conexión a internet

2. Clonar el repositorio

```sh
git clone https://github.com/PipsaDevs/discord-bot-template.git
cd discord-bot-template
```

3. Instalar dependencias

```sh
pnpm install
```

4. Variables de entorno
   Renombra el archivo .env.example a .env y pon la token de tu bot que puedes obtener a través del Portal de Desarrolladores de Discord

5. Iniciar el programa

```sh
pnpm run build
pnpm run start
```
