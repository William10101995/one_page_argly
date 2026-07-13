# Documentación de CI/CD (Integración y Despliegue Continuo)

Este documento describe el flujo completo de CI/CD para el proyecto **argly-web**, el cual utiliza GitHub Actions junto a una librería compartida de flujos de trabajo (*shared-library*).

## Diagrama de Flujo (Mermaid)

El siguiente diagrama ilustra cómo se integra y despliega el código:

```mermaid
flowchart TD
    %% Roles y Ramas
    Dev([Desarrollador])
    PR{Pull Request\na main}
    Merge{Merge a\nmain}

    %% Repositorio Actual
    subgraph Repo Actual ["argly-web (Repositorio App)"]
        CI_Trigger[Se activa ci.yml]
        CD_Trigger[Se activa cd.yml]
    end

    %% Librería Compartida
    subgraph Shared Library ["xlmriosx/shared-library"]
        CI_Lib[[Workflow: ci-react.yml]]
        CD_Lib[[Workflow: AWS-S3-deploy.yml]]
    end

    %% Tareas CI
    subgraph Tareas CI ["Validaciones CI"]
        NodeSetupCI[Setup Node.js]
        NpmInstallCI[npm ci]
        LintTest[Lint & Tests]
    end

    %% Tareas CD
    subgraph Tareas CD ["Construcción y Despliegue"]
        NodeSetupCD[Setup Node.js]
        NpmInstallCD[npm ci]
        Build[npm run build]
        OIDC[Autenticación AWS OIDC\nAsumir Rol IAM]
        S3Sync[AWS S3 Sync]
    end

    %% Destino
    AWS_S3[(Bucket S3:\nargly-web-static)]
    Notificaciones[[Notificaciones:\nDiscord / Slack / Teams]]

    %% Flujo CI
    Dev -->|Crea o actualiza| PR
    PR --> CI_Trigger
    CI_Trigger -->|Llama a| CI_Lib
    CI_Lib --> NodeSetupCI
    NodeSetupCI --> NpmInstallCI
    NpmInstallCI --> LintTest
    LintTest -.->|Informa estado| Notificaciones

    %% Flujo CD
    Dev -->|Aprueba y fusiona| Merge
    Merge --> CD_Trigger
    CD_Trigger -->|Llama a| CD_Lib
    CD_Lib --> NodeSetupCD
    NodeSetupCD --> NpmInstallCD
    NpmInstallCD --> Build
    Build --> OIDC
    OIDC -->|Solicita token OIDC\ncon AWS_ROLE_ARN| S3Sync
    S3Sync -->|Sube archivos\nestáticos| AWS_S3
    S3Sync -.->|Informa estado| Notificaciones

    %% Estilos
    classDef repo fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef shared fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef aws fill:#ffcc80,stroke:#e65100,stroke-width:2px;
```

## Explicación del Flujo

### 1. Integración Continua (CI)
- **Cuándo se ejecuta:** Cada vez que se crea un *Pull Request* hacia la rama `main` o se suben nuevos *commits* a un PR existente.
- **Flujo:** 
  1. El evento es capturado por el archivo local `.github/workflows/ci.yml`.
  2. Este archivo invoca al *reusable workflow* `ci-react.yml` que vive en el repositorio centralizado `xlmriosx/shared-library`.
  3. El workflow instala Node.js (v20), instala dependencias con caché (`npm ci`) y típicamente realiza validaciones estáticas (linters) y pruebas unitarias.
  4. Envía notificaciones de éxito o error al equipo mediante un webhook (ej. Discord).

### 2. Despliegue Continuo (CD)
- **Cuándo se ejecuta:** Al hacer `push` o aceptar un PR (hacer *Merge*) directamente en la rama `main`.
- **Flujo:**
  1. El evento es capturado por el archivo local `.github/workflows/cd.yml`.
  2. Invoca al *reusable workflow* `AWS-S3-deploy.yml` de la librería compartida.
  3. Prepara el entorno Node.js e instala dependencias (`npm ci`).
  4. Genera la versión de producción estática ejecutando `npm run build`.
  5. **Autenticación AWS (OIDC):** El workflow solicita un *token de identidad temporal* a GitHub y lo intercambia con AWS asumiendo el rol IAM (`github-actions-argly-web-deploy`) sin necesidad de llaves estáticas permanentes.
  6. **Sincronización:** Ejecuta el comando `aws s3 sync ./build s3://argly-web-static --delete` copiando el contenido construido al *Bucket de S3*.
  7. Notifica el estado final del despliegue (Discord, Teams o Slack).

## ¿Dónde se despliega?
El código se empaqueta como una aplicación estática (gracias al comando `build` de React/Next.js) y se sube al **bucket de AWS S3** denominado `argly-web-static`. El bucket aloja todos los archivos `.html`, `.js`, `.css` y dependencias (assets) que luego se sirven a la web.
