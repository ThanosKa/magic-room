/**
 * Renders one `<script type="application/ld+json">` per schema object. It
 * emits separate top-level nodes, not a single `@graph`; `graphSchema()` in
 * lib/seo/schema.ts is the opt-in for that.
 */
export function JsonLd({ schemas }: { schemas: unknown[] }) {
    return (
        <>
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}
