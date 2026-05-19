# OPCODES docs
Estamos haciendo esto porque para un sistema donde queremos que _muchos_ botones hagan _muchas_ cosas, necesitamos tener el mismo número de maneras de parsear la información.
La ID personalizada de un botón solo contiene 100 caracteres, por lo que cada acción se verá definida por un numero en hexadecimal (se puede cambiar de base numérica más adelante si se estima necesario)

Por cada acción (Operation) que queremos que haga un botón, se añadirá en el enumerator [`ButtonOPCodes.ts`](../../enums/ButtonOPCodes.ts) el correspondiente opcode a la operación (normalmente solo será el primer caracter, pero lo dicho, se puede modificar a medida que se desarrollen más botones que hagan más acciones), y aquí se indicará como parsear la instrucción correspondiente.

## Botones
### 0 ~ Ignorar la acción
Ignorar la acción

### 1 ~ Dar rol
Formato: A-B
- A: OPcode (1 caracter)
- B: El ID del rol a dar
