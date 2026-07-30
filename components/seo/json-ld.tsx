/**
 * Renders one `<script type="application/ld+json">` per schema object.
 *
 * The same four lines of `dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }}`
 * were repeated in eleven route files, in three different shapes (a `.map()`
 * over an array, a run of hand-written `<script>` tags, and a single tag). One
 * component, one shape.
 *
 * Note this emits separate top-level nodes, not a single `@graph`. Merging them
 * would change what every page renders; `graphSchema()` in lib/seo/schema.ts is
 * the opt-in for that and stays a caller's choice.
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
