# Specification: Sitemap Generation

## Requirements
- Automatically generate a `sitemap.xml` file.
- Include all public routes in the project.
- Handle localized routes (`[lang]`) for 'en' and 'es'.
- Exclude internal or layout-only routes.
- Ensure the sitemap is accessible at `/sitemap.xml`.
- Add a `robots.txt` file pointing to the sitemap.

## Scenarios
1. **Successful Generation**: Accessing `/sitemap.xml` returns a valid XML sitemap with all translated versions of pages.
2. **Robots.txt Integration**: Accessing `/robots.txt` shows the location of the sitemap.
3. **Parameter Handling**: The `[lang]` parameter is correctly expanded to 'en' and 'es' for each route.
