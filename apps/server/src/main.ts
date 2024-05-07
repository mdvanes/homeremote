import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app/app.module";

declare const module: {
    hot: {
        accept: () => void;
        dispose: (x: () => Promise<void>) => Promise<void>;
    };
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = ""; // This value was generated by nx with value 'api'
    app.setGlobalPrefix(globalPrefix);
    app.use(cookieParser());
    const port = process.env.PORT || 3333;

    if (process.env.NODE_ENV === "development") {
        Logger.log(`Starting OpenApi UI on http://localhost:${port}/api`);
        const config = new DocumentBuilder()
            .setTitle("Cats example")
            .setDescription("The cats API description")
            .setVersion("1.0")
            .addTag("cats")
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api", app, document);
    }

    await app.listen(port);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix} in ${
            process.env.NODE_ENV ?? "production"
        } mode`
    );
}

bootstrap();
