# Changelog (Historial de cambios)

## v1.0.0 - Tamo' vivo' migente
¡Hemos terminado de escribir la base principal de la template que queremos ofrecer a la comunidad! También coincide con que es _realmente_ el primer proyecto que publicamos, así que alegría y alboroto.

Mientras que la mayoría de commits han sido obra mía (@CyRstudent), he de decir que en parte también me he inspirado en el código que @inteltank1 escribió en otro proyecto similar.

Esto no es el fin del principio — Es el principio de un comienzo.

### Features (¿Qué hay nuevo?)
En muy resumidas cuentas, en los pocos ratos libres que tenemos de universidad, me he dedicado a escribir:
- La implementación de la clase [`BoundedQueue.ts`](src/classes/BoundedQueue.ts), que es esencialmente la implementación de lo que se conoce en Estructuras de Datos como una [_Cola limitada_](https://www.cs.cornell.edu/courses/cs4410/2010su/queue.pdf); Esta nos ha ayudado a implementar un [sistema de auditoría](src/classes/Log.ts) que no consuma mucha memoria.
- La implementación de interfaces esenciales como la de [`Event.ts`](src/interfaces/Event.ts), o la de [`SlashCommand.ts`](src/interfaces/SlashCommand.ts) (sneak peak btw).
- Enums que dan estructura a las distintas interfaces.
- Funciones de utilidad, como para [escanear directorios](src/util/scanDir.ts)
- Un [slash command básico](src/slash_commands/ping.ts), pero todavía no funciona (`v1.1.0` incoming ;) )
- Finalmente, la clase extendida de discord.js/Client [`Client.ts`](src/classes/Client.ts), que es basicamente el nudo que ata todos los fundamentos del proyecto

> [!NOTE]
> Aunque ya hay muchas cosas, _todavía_ no está listo para que le hagas una copia y lo uses con tu propio bot.

### Bug fixes 
Ninguno, y esperamos que siga así a medida que avancemos versiones...

### What's next? / ¿Qué va a ser lo siguiente?
Para la `v1.1.0` escribiremos un sistema decente de gestión y respuesta de slash commands.
También un `README.md` porque, ¿qué sentido tiene un proyecto diseñado para que otra gente use sin un manual? :sob:

"ESTO ES MUY POGGERS XDXDXD"
> @inteltank1, profesor de la UMA (no oficial) (sin contrato)

## v1.0.1 - Errores del ~~directo~~ comienzo
En muy pocas palabras, hemos arreglado un par de cosas de los archivos de configuración de TypeScript, y también hemos actualizado la url del repositorio en el paquete de npm. Cosillas que pasan, supongo.

### Features (¿Qué hay nuevo?)
- [`tsconfig.node.json`](./tsconfig.node.json), el archivo que nos ayuda a que la configuración de eslint no llore y se queje
- Hemos actualizado los tipos de node

### Bug fixes 
- Actualizada la URL del repositorio en los archivos [`package.json`](./package.json) y [`package-lock.json`](./package-lock.json)
- Ajustada la configuración del compilador de typescript para que el archivo de configuración de eslint no se sienta excluido XD

## v1.1.0 - Ya llegaron ~~los reyes magos~~ soporte para interacciones
Chat, nos lo estabais pidiendo (nadie ve este repositorio), y os lo hemos dado: ¡Soporte para interacciones!
Sin más dilación, os cuento las nuevas features.

### Features (¿Qué hay nuevo?)
- Interfaz para los handlers de las interacciones [`InteractionHandler.ts`](src/interfaces/InteractionHandler.ts).
- Soporte para el evento [`interactionCreate.ts`](src/events/interactionCreate.ts), que delega la interacción al correspondiente handler.
- El handler de Slash Commands [`ChatInputCommand.ts`](src/interactions/handlers/ChatInputCommand.ts), que se encarga de gestionar los comandos de barra del bot.
- Una nueva estructura de archivos. Ahora, en vez de solo haber una carpeta llamada "slash_commands", hay una carpeta llamada [`interactions`](src/interactions), que contiene handlers para los distintos tipos de interacciones, aparte de la ya conocida carpeta que contiene los comandos de barra.
- La función de utilidad [`toError.ts`](src/util/toError.ts), que nos gestiona el dolor de cabeza que supone parsear el parametro de error en los bloques try-catch
- La propiedad en la clase del cliente [`Client#developers`](src/classes/Client.ts#L18), que contiene las IDs de los desarrolladores registrados en el portal de desarrolladores (o las que incluyas tú en el constructor, vamos)
- El esperado [`README.md`](README.md). Sé que _todavía_ no es el mejor, pero la carrera va antes :wilted_flower:

### Bug fixes 
Ninguno, porque no hay.

### What's next? / ¿Qué va a ser lo siguiente?
Probablemente mejorar el README.md, y añadir un script que despliegue los comandos del bot de manera global y en un servidor en especifico.

> [!NOTE]
> Ya puedes copiar este repositorio e intentar hacer cosas, pero todavía le faltan cosas a las interacciones, como por ejemplo, el script del despliegue.

"Feliz año nuevo!11!!!1!1"
> @CyRstudent a 22/07/2025, futuro ingeniero

## v1.1.1 - Hotfix
Resulta que hay que gestionar los imports de un mejor modo, sobre todo CUANDO COMPILAS LA CARPETA [`src`](src) (internal rage goes brrrrrrr)

### Features (¿Qué hay nuevo?)
Nada.

### Bug fixes 
- [`scanDir.ts`](src/util/scanDir.ts) ahora devuelve una lista de strings, y no una lista de Dirents y listas de Dirents...
- [`Client.ts`](src/classes/Client.ts) usa los imports correctos, independientemente de que lo corras usando ts-node o compilandolo y despues corriendolo desde dist.

### What's next? / ¿Qué va a ser lo siguiente?
El script para desplegar los comandos de barra de manera global ;)

"Mi sueño es ser Ingeniero del Software"
> @CyRstudent con 13 años, sin saber la desgracia y la gracia de estar mirando a tu pantalla durante 4h intentando figurar qué bug ha hecho.

## v1.1.2 - Despliegue de comandos
Ya hago un patch para que el siguiente PR sea algo más heavy.

### Features (¿Qué hay nuevo?)
- [`deploySlashCommands.ts`](src/deploySlashCommands.ts), el script que despliega los comandos de manera global
- El script correspondiente [`npm run deploy`](package.json#L17)

### Bug fixes 
Ninguno.

### What's next? / ¿Qué va a ser lo siguiente?
¿Soporte para botones? Lo iré viendo conforme vea.

## v1.1.3 - Soporte para Botones (y componentes de mensajes en general)
¡MUY BUENOS DÍAS! Ya estamos cada vez más cerca de hacer esta plantilla funcional. Tenemos ya soporte para botones y soporte para muchas cosas que podremos implementar en el futuro de una manera más fácil.

### Features (¿Qué hay nuevo?)
- El enum [`ButtonOPCodes.ts`](src/enums/ButtonOPCodes.ts), que nos ayuda a determinar qué acción hará un botón
- La interfaz [`ButtonCommand.ts`](src\interfaces\ButtonCommand.ts), que da estructura a un comando de botón
- El handler [`ButtonHandler.ts`](src\interactions\handlers\ButtonHandler.ts), que da soporte para las interacciones de botones.
- La propiedad [`Client#buttonCommands`](src/classes/Client.ts#L24), una colección de comandos

### Bug fixes
- Hemos actualizado el script `npm run format:check` para que no compruebe archivos que no sean de typescript...

### What's next? / ¿Qué va a ser lo siguiente?
- Implementaremos algunos ejemplos de comandos para que se clarifique como se debe de construir un comando. También tenemos planes de hacer un README decente e implementar una herramienta que nos genere una pagina de documentación en base a los comentarios JSDocs.

"¿Esta integral se hace por cambio de variable o por cambio de carrera?"
> Muchos compañeros (estamos ya a finales de mayo)

## v1.1.4 - Muchas cosas // Miscellaneous
He hecho un montón de cosas, y no sé como agruparlas bajo un título, así que aquí os las comentos.

### Features (¿Qué hay nuevo?)
- Comando de barra [`ayuda.ts`](src/interactions/slash_commands/ayuda.ts). No creo que me haga mucha falta describirlo...
- Un [comando simple](src\interactions\slash_commands\role-selector.ts) de selector de roles integrado con su correspondiente [comando de botón](src\interactions\button_commands\role-selector.ts).
- Archivo de configuración para nodemon [`nodemon.json`](nodemon.json)
- Hemos reemplazado el paquete `ts-node` por `tsx`

### Bug fixes 
- Hemos compilado los tipos en otra carpeta en `dist/`
- Incluir los archivos `.ts` en [`scanDir.ts`](src\util\scanDir.ts)

### What's next? / ¿Qué va a ser lo siguiente?
Seguimos teniendo pendiente lo de la documentación, así que eso.

## v1.1.5 - ¿Un adiós o un hasta pronto?
Esta versión finalmente marca un hito, ya hemos construido una versión funcional de la plantilla. Hemos implementado muchas cosas que despues puedes coger y seguir desarrollando o implementado sin tener que escribir _todo_ desde 0.

### Features (¿Qué hay nuevo?)
- El comando de barra [`eval.ts`](src\interactions\slash_commands\dev\eval.ts), que permite evaluar expresiones en el entorno a través de Discord
- El comando de barra [`reiniciar.ts`](src\interactions\slash_commands\dev\reiniciar.ts), que permite reiniciar el bot (tanto proceso como cliente ws a distanica).
- Hemos reorganizado los comandos de barra en carpetas que van acorde a las categorias que ya hemos definido en [`CommandCategory.ts`](src\enums\CommandCategory.ts)

> [!WARNING]
> El comando `/eval` puede ser la perdición en manos de la persona equivocada. Aún estando marcado como [`CommandCategory#DEV`](src\enums\CommandCategory.ts#L6), que, consecuentemente, deja que solo los desarrolladores cuyos IDs están en la propiedad [`Client#developers`](C:\Users\hsmad\proyectos\discord-bot-example\src\classes\Client.ts#L30) ejecuten el comando, asegurate que cuando corras el bot, reconozcas *TODOS* los IDs.

### Bug fixes
¡Ninguno!

### What's next? / ¿Qué va a ser lo siguiente?
El repositorio va a estar un tiempo inactivo, pero iremos documentando todo el proyecto cuando tengamos más tiempo ;)

"Bro rafa tengo una idea"
> @CyRstudent el día antes de empezar este repo
