import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Root of the DynamicDataModel repository
const repoRoot = path.resolve(__dirname, '..');

const emptyModulePath = path.resolve(__dirname, 'src/mocks/emptyModule.ts');

// Directories under Core.DynamicDataModel that are NOT the Renderer.
// Imports that originate here and fail resolution are silently stubbed.
const DESIGNER_DIR_RE = /[\\/]Core\.DynamicDataModel[\\/](?!Renderer)/;

/**
 * Stub-unknown-packages plugin
 *
 * 1. Any bare-specifier import that Rollup cannot resolve (e.g. @reduxjs/toolkit)
 *    is redirected to the empty-module stub.
 * 2. Any relative import that cannot be resolved AND originates from a
 *    Designer/DataModelBrief/etc. file is also stubbed.
 *
 * These modules are only referenced by Designer code never rendered in the demo.
 */
function stubUnknownPackages(): Plugin {
  const warned = new Set<string>();
  function warn(id: string) {
    if (!warned.has(id)) {
      console.warn(`[stub-unknown-packages] Stubbing: "${id}"`);
      warned.add(id);
    }
  }
  return {
    name: 'stub-unknown-packages',
    enforce: 'pre',
    async resolveId(id, importer, options) {
      const isRelative = id.startsWith('.') || id.startsWith('/') || path.isAbsolute(id);

      if (!isRelative) {
        // Bare specifier — skip things we already alias
        if (
          id.startsWith('Core.DynamicDataModel') ||
          id.startsWith('Models') ||
          id.startsWith('Utility')
        ) return null;

        const resolved = await this.resolve(id, importer, { skipSelf: true, ...options });
        if (resolved) return null;
        warn(id);
        return emptyModulePath;
      }

      // Relative import from a non-Renderer Designer file → stub if it can't resolve
      if (importer && DESIGNER_DIR_RE.test(importer)) {
        const resolved = await this.resolve(id, importer, { skipSelf: true, ...options });
        if (resolved) return null;
        warn(`${id} (from ${importer.replace(repoRoot, '')})`);
        return emptyModulePath;
      }

      return null;
    },
  };
}

export default defineConfig({
  plugins: [react(), stubUnknownPackages()],
  resolve: {
    alias: [
      // ── Shims for Didgah-private packages ─────────────────────────────────
      // Sub-path aliases MUST come before the root alias
      {
        find: 'didgah/ant-core-component/providers',
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: 'didgah/ant-core-component',
        replacement: path.resolve(__dirname, 'src/mocks/antCoreComponent.tsx'),
      },
      {
        find: 'didgah/common',
        replacement: path.resolve(__dirname, 'src/mocks/common.ts'),
      },
      {
        find: 'blockly',
        replacement: path.resolve(__dirname, 'src/mocks/blockly.ts'),
      },

      // ── @didgah-components/ant-table ──────────────────────────────────────
      // /utils sub-path must appear before the root alias.
      {
        find: '@didgah-components/ant-table/utils',
        replacement: path.resolve(__dirname, 'src/mocks/antTableUtils.tsx'),
      },
      {
        find: '@didgah-components/ant-table',
        replacement: path.resolve(__dirname, 'src/mocks/antTable.tsx'),
      },

      // ── TS/Validations — Designer-only, breaks circular dep with Widget/Edit ─
      // Chain: WidgetFactory → SimpleDesigner/hooks/useField → designLayoutSlice
      //        → TS/Validations → Widget/Edit (already loading) = TDZ crash
      {
        find: /.*\/TS\/Validations(\.ts)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },

      // ── layoutRenderer / wrapperLayouts — break circular dep with DefineLayout ─
      // Chain A: defineLayout → WidgetFactory → Widget/Edit/referenceDefine
      //          → layoutRenderer → wrapperLayouts → DefineLayout (still loading)
      // Chain B: defineLayout → LayoutManager → Designer/LayoutDefineDesigner
      //          → LayoutPreviewer → wrapperLayouts → DefineLayout (still loading)
      // Neither layoutRenderer nor wrapperLayouts is needed in the demo
      // (DDMFormRenderer uses DefineLayout directly).
      {
        find: /.*\/Renderer\/layoutRenderer(\.tsx?)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: /.*\/Renderer\/components\/wrapperLayouts(\.tsx?)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },

      // ── Utility shims — regex intercepts both module and relative imports ──
      {
        find: /.*\/Utility\/language(\.ts)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/utilityLanguage.ts'),
      },
      {
        find: /.*\/Utility\/helpers(\.ts)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/utilityHelpers.ts'),
      },
      {
        find: /.*\/Utility\/encryption(\.ts)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/utilityEncryption.ts'),
      },

      // ── Designer-only packages (never rendered in Renderer demo) ─────────
      // Regex patterns catch both root and any sub-path imports.
      {
        find: /^@models\/didgah-components(\/.*)?$/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: /^@didgah\/.+/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: /^@didgah-components\/(?!ant-table).+/,
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: 'ts-enum-util',
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      {
        find: 'react-window',
        replacement: path.resolve(__dirname, 'src/mocks/emptyModule.ts'),
      },
      // ── Convenience aliases for the real library source ───────────────────
      {
        find: 'Core.DynamicDataModel',
        replacement: path.resolve(repoRoot, 'Core.DynamicDataModel'),
      },
      {
        find: 'Models',
        replacement: path.resolve(repoRoot, 'Models'),
      },
      {
        find: 'Utility',
        replacement: path.resolve(repoRoot, 'Utility'),
      },
    ],
  },
  build: {
    rollupOptions: {
      // Silently stub any named export that our empty-module stubs don't declare.
      // All Designer/DataModelBrief imports are stubbed; their named exports are
      // never actually called in the Renderer demo.
      shimMissingExports: true,
    },
  },
  server: {
    fs: {
      allow: [repoRoot, __dirname],
    },
  },
});
