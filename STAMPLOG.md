# v0.5.1 - New User & Bot types
June.03, 2026

- `feat`: User and Bot interfaces now support the native `.active` property. We also implemented the `BotAccessToken` type. <!--1a27be790f225cf6c35aa63cbef328ead80aead3-->

# v0.5.0 - Improved typing
June.03, 2026

- `feat`: You can now define with the type if you expect the result of a query to be `null`. Some results can be null, and before this release, you couldn't allow this behavior in TypeScript. <!--6eeb0c9c34643e64e79fa9cb86a983113145df44-->
- `fix`: A minor fix on the `onprogress` method typing by using the `ProgressEvent` type <!--cee3956185aa90d10b1db8f39ceddc38057e0c78-->

