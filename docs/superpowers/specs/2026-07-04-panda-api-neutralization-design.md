# Panda API Content Neutralization Design

## Purpose
The current content returned by the Panda APIs (`/panda/*`) leans heavily towards software engineering and tech startup contexts. The goal is to neutralize this content so it is suitable for everyone, while exclusively affecting the Panda APIs (leaving legacy routes unchanged). 

## Approach
Instead of rewriting the underlying database or seed files, we will apply an API-level filter. A utility function will intercept the text retrieved from the database and dynamically replace tech jargon with neutral terminology before returning the response to the client.

## Components

### 1. `neutralizeContent(text)` Utility
A new function will be created (likely placed in a utils file or directly in `routes/reading.js` if it's small enough). This function will use a series of regular expressions to perform case-insensitive replacements.

**Mapping Examples:**
- "software engineering" -> "your profession"
- "software maintenance" -> "routine maintenance"
- "tech stack" -> "systems"
- "code" -> "work"
- "startup" -> "new venture"
- "technical debt" -> "operational debt"
- "tech paradigms" -> "industry paradigms"
- "Micro Frontend" -> "complex structural"
- "React components" -> "intricate components"
- "Swift issues" -> "complex issues"

### 2. Integration in `routes/reading.js`
The `getCosmosInterpretation(lens)` function will be updated:
```javascript
const text = cosmosDb.lookup(lens, key);
const neutralText = text ? neutralizeContent(text) : '';
return { title: key.name, content: neutralText };
```
This ensures the filter applies to `/panda/career`, `/panda/relationship`, `/panda/advice`, and all other Panda routes, but does not affect legacy routes like `/api/advice` or `/api/career`.

## Trade-offs
- **Pros:** Fast implementation, leaves the original database untouched, strictly limits the scope of changes to the Panda APIs.
- **Cons:** Relies on regex replacement which might miss edge cases or occasionally produce slightly awkward phrasing if a mapped word is used in an unexpected context.

## Testing
- Verify that calling a Panda endpoint returns the neutralized content.
- Verify that calling the legacy equivalent returns the original software engineering content.
- Verify no errors occur when the database returns an empty string.