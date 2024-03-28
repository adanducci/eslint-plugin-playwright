import { Rule } from 'eslint'
import { parseFnCall } from '../utils/parseFnCall'

export default {
  create(context) {
    const options = {
      allow: [] as string[],
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    }

    return {
      CallExpression(node) {
        const call = parseFnCall(context, node)
        if (!call) return

        if (call.type === 'hook' && !options.allow.includes(call.name)) {
          context.report({
            data: { hookName: call.name },
            messageId: 'unexpectedHook',
            node,
          })
        }
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow setup and teardown hooks',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-hooks.md',
    },
    messages: {
      unexpectedHook: "Unexpected '{{ hookName }}' hook. The use of these hooks may result in shared state between tests.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allow: {
            contains: ['beforeAll', 'beforeEach', 'afterAll', 'afterEach'],
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule
