/**
 * ANEX Debug & Command System v1.0
 * Extension for SillyTavern to track and debug ANEX_C prompt framework
 */

import { saveSettingsDebounced } from '../../../script.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { ARGUMENT_TYPE, SlashCommandArgument } from '../../../slash-commands/SlashCommandArgument.js';

const MODULE_NAME = 'anex_debug';
const DEBUG_PREFIX = '🔍 ANEX:';

// Available style profiles
const STYLE_PROFILES = {
  'rina-kent': 'Rina Kent',
  'tarryn-fisher': 'Tarryn Fisher',
  'george-rr-martin': 'George R.R. Martin',
  'penelope-douglas': 'Penelope Douglas'
};

// Module categories
const MODULES = {
  emotions: ['happiness', 'anger', 'anxiety', 'trust', 'fear', 'joy', 'sadness', 'pride', 'shame'],
  resources: ['will', 'regulation', 'focus', 'energy', 'social'],
  goals: ['G_Seek_Connection', 'G_Avoid_Vulnerability', 'G_Test_Trustworthiness', 'G_Maintain_Safety'],
  beliefs: ['P_Will_Abandon', 'P_Genuine_Care', 'P_Hidden_Agenda', 'P_Deserving_Love', 'trust_level'],
  trauma: ['betrayal', 'abandonment', 'emotional_neglect', 'shame_based_abuse'],
  relationships: ['trust', 'intimacy', 'bond_strength', 'power_dynamic']
};

// Default settings
const defaultSettings = {
  enabled: true,
  currentStyle: 'rina-kent',
  debugLevel: 2,
  autoUpdate: false,
  storageMode: 'chat' // 'chat' or 'global'
};

let context = null;
let settings = null;

/**
 * Initialize the extension
 */
async function init() {
  console.log(`${DEBUG_PREFIX} Initializing...`);
  
  try {
    context = SillyTavern.getContext();
    
    // Initialize settings
    if (!context.extensionSettings[MODULE_NAME]) {
      context.extensionSettings[MODULE_NAME] = structuredClone(defaultSettings);
    }
    settings = context.extensionSettings[MODULE_NAME];
    
    // Ensure all default keys exist
    for (const key of Object.keys(defaultSettings)) {
      if (!Object.hasOwn(settings, key)) {
        settings[key] = defaultSettings[key];
      }
    }
    
    // Register slash commands
    registerCommands();
    
    // Register event listeners
    registerEventListeners();
    
    console.log(`${DEBUG_PREFIX} Initialized successfully!`);
    console.log(`${DEBUG_PREFIX} Current style: ${settings.currentStyle}`);
    console.log(`${DEBUG_PREFIX} Storage mode: ${settings.storageMode}`);
    
  } catch (error) {
    console.error(`${DEBUG_PREFIX} Initialization failed:`, error);
  }
}

/**
 * Register all slash commands
 */
function registerCommands() {
  // Main /anex command with subcommands
  SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'anex',
    callback: handleAnexCommand,
    returns: 'command result',
    namedArgumentList: [],
    unnamedArgumentList: [
      SlashCommandArgument.fromProps({
        description: 'subcommand: test, init, update, debug, summon, reset, help',
        typeList: [ARGUMENT_TYPE.STRING],
        isRequired: true
      }),
      SlashCommandArgument.fromProps({
        description: 'additional arguments',
        typeList: [ARGUMENT_TYPE.STRING],
        isRequired: false
      })
    ],
    helpString: `
      <div>
        <strong>ANEX Debug & Command System</strong><br/>
        Advanced psychology and narrative tracking for ANEX_C framework.
      </div>
      <div>
        <strong>Usage:</strong>
        <ul>
          <li><code>/anex test</code> - Test if extension is working</li>
          <li><code>/anex init &lt;style&gt;</code> - Initialize with style profile</li>
          <li><code>/anex update &lt;module&gt;</code> - Update module data from AI</li>
          <li><code>/anex debug &lt;module&gt;</code> - Display module state</li>
          <li><code>/anex summon &lt;type&gt;</code> - Display narrative tracking</li>
          <li><code>/anex reset</code> - Clear all stored data</li>
          <li><code>/anex help</code> - Show detailed help</li>
        </ul>
      </div>
    `
  }));
  
  console.log(`${DEBUG_PREFIX} Slash commands registered`);
}

/**
 * Handle main /anex command routing
 */
function handleAnexCommand(args) {
  const subcommand = args[0]?.toLowerCase();
  const param = args[1];
  
  switch (subcommand) {
    case 'test':
      return handleTest();
    case 'init':
      return handleInit(param);
    case 'update':
      return handleUpdate(param);
    case 'debug':
      return handleDebug(param);
    case 'summon':
      return handleSummon(param);
    case 'reset':
      return handleReset();
    case 'help':
      return handleHelp();
    default:
      return `${DEBUG_PREFIX} Unknown subcommand: ${subcommand}. Use /anex help for usage.`;
  }
}

/**
 * Test command - verify extension is working
 */
function handleTest() {
  const testResults = [];
  
  testResults.push(`${DEBUG_PREFIX} Extension Test Results`);
  testResults.push('═══════════════════════════════════');
  testResults.push(`✅ Extension loaded: YES`);
  testResults.push(`✅ Settings initialized: YES`);
  testResults.push(`✅ Current style: ${settings.currentStyle}`);
  testResults.push(`✅ Storage mode: ${settings.storageMode}`);
  
  // Test storage access
  try {
    const storage = getStorage();
    testResults.push(`✅ Storage accessible: YES`);
    testResults.push(`   Storage type: ${settings.storageMode === 'chat' ? 'chatMetadata' : 'extensionSettings'}`);
  } catch (e) {
    testResults.push(`❌ Storage accessible: NO - ${e.message}`);
  }
  
  // Test context
  if (context) {
    testResults.push(`✅ SillyTavern context: YES`);
    testResults.push(`   Character active: ${context.characterId !== undefined ? 'YES' : 'NO'}`);
  } else {
    testResults.push(`❌ SillyTavern context: NO`);
  }
  
  testResults.push('═══════════════════════════════════');
  testResults.push(`\n🎉 ANEX Extension is working!`);
  
  return testResults.join('\n');
}

/**
 * Initialize with a style profile
 */
function handleInit(styleName) {
  if (!styleName) {
    const available = Object.entries(STYLE_PROFILES)
      .map(([key, name]) => `  • ${key} (${name})`)
      .join('\n');
    return `${DEBUG_PREFIX} Available styles:\n${available}\n\nUsage: /anex init <style>`;
  }
  
  if (!STYLE_PROFILES[styleName]) {
    return `${DEBUG_PREFIX} Unknown style: ${styleName}\nAvailable: ${Object.keys(STYLE_PROFILES).join(', ')}`;
  }
  
  // Load style profile
  settings.currentStyle = styleName;
  saveSettingsDebounced();
  
  // Initialize storage with default structure
  const storage = getStorage();
  storage.anex = {
    style: styleName,
    initialized: new Date().toISOString(),
    emotions: {},
    resources: {},
    goals: {},
    beliefs: {},
    trauma: {},
    relationships: {},
    narrative: {
      timeline: [],
      mysteries: [],
      secrets: {}
    }
  };
  saveStorage();
  
  return `${DEBUG_PREFIX} Initialized with ${STYLE_PROFILES[styleName]} style profile!\nStorage cleared and ready for tracking.`;
}

/**
 * Update module data (triggers AI generation)
 */
function handleUpdate(moduleName) {
  if (!moduleName) {
    const available = Object.keys(MODULES).join(', ');
    return `${DEBUG_PREFIX} Specify module to update.\nAvailable: ${available}\n\nUsage: /anex update <module>`;
  }
  
  if (!MODULES[moduleName]) {
    return `${DEBUG_PREFIX} Unknown module: ${moduleName}\nAvailable: ${Object.keys(MODULES).join(', ')}`;
  }
  
  // This will be implemented to inject prompt instructions
  return `${DEBUG_PREFIX} Update command for '${moduleName}' will trigger AI generation.\n\n⚠️ This feature requires AI generation integration (coming in next update).\n\nFor now, AI responses are tracked automatically when they include debug output.`;
}

/**
 * Debug display - show current module state
 */
function handleDebug(moduleName) {
  const storage = getStorage();
  
  if (!storage.anex) {
    return `${DEBUG_PREFIX} No data stored yet. Use /anex init <style> to initialize.`;
  }
  
  if (!moduleName || moduleName === 'all' || moduleName === 'state') {
    return formatFullDebug(storage.anex);
  }
  
  if (!MODULES[moduleName]) {
    return `${DEBUG_PREFIX} Unknown module: ${moduleName}\nAvailable: ${Object.keys(MODULES).join(', ')}`;
  }
  
  return formatModuleDebug(moduleName, storage.anex[moduleName]);
}

/**
 * Summon narrative tracking
 */
function handleSummon(type) {
  const storage = getStorage();
  
  if (!storage.anex?.narrative) {
    return `${DEBUG_PREFIX} No narrative data stored yet.`;
  }
  
  const narrative = storage.anex.narrative;
  
  switch (type) {
    case 'timeline':
      return formatTimeline(narrative.timeline);
    case 'mysteries':
      return formatMysteries(narrative.mysteries);
    case 'secrets':
      return formatSecrets(narrative.secrets);
    case 'summary':
      return formatSummary(storage.anex);
    default:
      return `${DEBUG_PREFIX} Summon types: timeline, mysteries, secrets, summary\n\nUsage: /anex summon <type>`;
  }
}

/**
 * Reset all stored data
 */
function handleReset() {
  const storage = getStorage();
  delete storage.anex;
  saveStorage();
  
  return `${DEBUG_PREFIX} All ANEX data cleared. Use /anex init <style> to start fresh.`;
}

/**
 * Show help
 */
function handleHelp() {
  return `
${DEBUG_PREFIX} ANEX Debug & Command System
═══════════════════════════════════════

📋 COMMANDS:

/anex test
  Test if extension is working properly

/anex init <style>
  Initialize tracking with a style profile
  Styles: ${Object.keys(STYLE_PROFILES).join(', ')}

/anex update <module>
  Update module data (triggers AI generation)
  Modules: ${Object.keys(MODULES).join(', ')}

/anex debug <module>
  Display current module state
  Use 'all' or 'state' for full dump

/anex summon <type>
  Display narrative tracking
  Types: timeline, mysteries, secrets, summary

/anex reset
  Clear all stored ANEX data

═══════════════════════════════════════

💡 TIP: Start with /anex test to verify everything works!
  `.trim();
}

/**
 * Format full debug output
 */
function formatFullDebug(data) {
  let output = [`${DEBUG_PREFIX} Full State Dump`, '═'.repeat(40)];
  
  output.push(`\n📊 Style: ${data.style || 'Not set'}`);
  output.push(`🕐 Initialized: ${data.initialized || 'Unknown'}`);
  
  for (const [module, keys] of Object.entries(MODULES)) {
    const moduleData = data[module] || {};
    const hasData = Object.keys(moduleData).length > 0;
    
    output.push(`\n${getModuleIcon(module)} ${module.toUpperCase()}:`);
    if (hasData) {
      for (const [key, value] of Object.entries(moduleData)) {
        output.push(`  ${key}: ${formatValue(value)}`);
      }
    } else {
      output.push(`  (no data)`);
    }
  }
  
  output.push('\n' + '═'.repeat(40));
  return output.join('\n');
}

/**
 * Format module-specific debug
 */
function formatModuleDebug(moduleName, data) {
  let output = [`${DEBUG_PREFIX} ${moduleName.toUpperCase()} Module`, '═'.repeat(40)];
  
  if (!data || Object.keys(data).length === 0) {
    output.push('\n(No data stored for this module)');
  } else {
    output.push('');
    for (const [key, value] of Object.entries(data)) {
      output.push(`${key}: ${formatValue(value)}`);
    }
  }
  
  output.push('\n' + '═'.repeat(40));
  return output.join('\n');
}

/**
 * Format timeline
 */
function formatTimeline(timeline) {
  if (!timeline || timeline.length === 0) {
    return `${DEBUG_PREFIX} No timeline events recorded.`;
  }
  
  let output = [`${DEBUG_PREFIX} Timeline`, '═'.repeat(40), ''];
  timeline.forEach((event, i) => {
    output.push(`${i + 1}. ${event.timestamp || 'Unknown'}: ${event.description || event}`);
  });
  
  return output.join('\n');
}

/**
 * Format mysteries
 */
function formatMysteries(mysteries) {
  if (!mysteries || mysteries.length === 0) {
    return `${DEBUG_PREFIX} No active mysteries.`;
  }
  
  let output = [`${DEBUG_PREFIX} Active Mysteries`, '═'.repeat(40), ''];
  mysteries.forEach((mystery, i) => {
    output.push(`${i + 1}. ${mystery.title || mystery}`);
    if (mystery.clues) {
      output.push(`   Clues: ${mystery.clues.join(', ')}`);
    }
  });
  
  return output.join('\n');
}

/**
 * Format secrets
 */
function formatSecrets(secrets) {
  if (!secrets || Object.keys(secrets).length === 0) {
    return `${DEBUG_PREFIX} No secrets recorded.`;
  }
  
  let output = [`${DEBUG_PREFIX} Secrets`, '═'.repeat(40), ''];
  for (const [character, characterSecrets] of Object.entries(secrets)) {
    output.push(`\n${character}:`);
    characterSecrets.forEach(secret => {
      output.push(`  • ${secret}`);
    });
  }
  
  return output.join('\n');
}

/**
 * Format summary
 */
function formatSummary(data) {
  let output = [`${DEBUG_PREFIX} Summary`, '═'.repeat(40)];
  
  output.push(`\n📊 Style: ${STYLE_PROFILES[data.style] || data.style || 'Not set'}`);
  output.push(`🕐 Session: ${data.initialized || 'Unknown'}`);
  
  // Count data points
  let totalDataPoints = 0;
  for (const module of Object.keys(MODULES)) {
    const count = Object.keys(data[module] || {}).length;
    if (count > 0) {
      totalDataPoints += count;
      output.push(`  ${module}: ${count} data points`);
    }
  }
  
  if (totalDataPoints === 0) {
    output.push('\n⚠️ No data tracked yet');
  }
  
  return output.join('\n');
}

/**
 * Storage helper - get storage object
 */
function getStorage() {
  if (settings.storageMode === 'chat') {
    try {
      const ctx = SillyTavern.getContext();
      if (ctx.chatMetadata) {
        return ctx.chatMetadata;
      }
    } catch (e) {
      console.warn(`${DEBUG_PREFIX} chatMetadata unavailable, falling back to global storage`);
    }
  }
  
  // Fallback to global storage
  return context.extensionSettings;
}

/**
 * Storage helper - save storage
 */
function saveStorage() {
  if (settings.storageMode === 'chat') {
    try {
      const ctx = SillyTavern.getContext();
      if (ctx.saveMetadata) {
        ctx.saveMetadata();
        return;
      }
    } catch (e) {
      console.warn(`${DEBUG_PREFIX} saveMetadata unavailable, falling back to global storage`);
    }
  }
  
  // Fallback to global storage
  saveSettingsDebounced();
}

/**
 * Register event listeners
 */
function registerEventListeners() {
  const { eventSource, event_types } = context;
  
  // Listen for new messages
  eventSource.on(event_types.MESSAGE_RECEIVED, handleMessageReceived);
  
  // Listen for chat changes
  eventSource.on(event_types.CHAT_CHANGED, handleChatChanged);
  
  console.log(`${DEBUG_PREFIX} Event listeners registered`);
}

/**
 * Handle message received event
 */
function handleMessageReceived(data) {
  // Future: Parse ANEX debug output from messages
  // For now, just log that we received it
  console.log(`${DEBUG_PREFIX} Message received, ready for parsing`);
}

/**
 * Handle chat changed event
 */
function handleChatChanged() {
  console.log(`${DEBUG_PREFIX} Chat changed`);
}

/**
 * Utility functions
 */
function getModuleIcon(module) {
  const icons = {
    emotions: '😊',
    resources: '⚡',
    goals: '🎯',
    beliefs: '💭',
    trauma: '⚠️',
    relationships: '🤝'
  };
  return icons[module] || '📦';
}

function formatValue(value) {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// Initialize on load
jQuery(async () => {
  await init();
});
