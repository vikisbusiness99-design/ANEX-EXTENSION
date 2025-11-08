# ANEX Debug & Command System

Advanced psychology and narrative tracking extension for SillyTavern, designed to work with the ANEX_C prompt framework.

## Features

- 🔍 **Debug Commands** - Inspect emotional states, resources, goals, beliefs, trauma, and relationships
- 📊 **Style Profiles** - Pre-configured personality profiles (Rina Kent, Tarryn Fisher, George R.R. Martin, Penelope Douglas)
- 📝 **Narrative Tracking** - Timeline, mysteries, secrets, and relationship tracking
- 💾 **Persistent Storage** - Data survives across chat sessions
- ⚡ **Real-time Monitoring** - Automatic parsing of AI responses (coming soon)

## Installation

### Method 1: Manual Installation (Recommended for Development)

1. Navigate to your SillyTavern installation folder
2. Go to `scripts/extensions/third-party/`
3. Create a new folder called `ANEX-Debug`
4. Copy all extension files into this folder:
   ```
   ANEX-Debug/
   ├── manifest.json
   ├── index.js
   ├── style.css
   └── styles/
       ├── rina-kent.json
       ├── tarryn-fisher.json
       ├── george-rr-martin.json
       └── penelope-douglas.json
   ```
5. Restart SillyTavern or reload the page
6. Go to Extensions → Manage Extensions
7. Find "ANEX Debug & Command System" and enable it

### Method 2: GitHub Installation (Future)

Once uploaded to GitHub:
1. Go to Extensions → Install Extension
2. Paste the GitHub repository URL
3. Click Install

## Quick Start

### 1. Test the Extension

```
/anex test
```

This verifies the extension is loaded and working.

### 2. Initialize with a Style Profile

```
/anex init rina-kent
```

Available styles:
- `rina-kent` - Aggressive, dominant, hot-tempered
- `tarryn-fisher` - Delusional, obsessive, emotionally volatile
- `george-rr-martin` - Calculating, politically aware, grounded
- `penelope-douglas` - Dark romance, intense conflicts, power dynamics

### 3. Check Current State

```
/anex debug all
```

Shows all tracked modules and their current values.

## Commands Reference

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/anex test` | Test if extension is working | `/anex test` |
| `/anex help` | Show detailed help | `/anex help` |
| `/anex init <style>` | Initialize with style profile | `/anex init rina-kent` |
| `/anex reset` | Clear all stored data | `/anex reset` |

### Debug Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/anex debug all` | Show full state dump | `/anex debug all` |
| `/anex debug emotions` | Show emotion values | `/anex debug emotions` |
| `/anex debug resources` | Show resource levels | `/anex debug resources` |
| `/anex debug goals` | Show goal priorities | `/anex debug goals` |
| `/anex debug beliefs` | Show belief states | `/anex debug beliefs` |
| `/anex debug trauma` | Show trauma triggers | `/anex debug trauma` |
| `/anex debug relationships` | Show relationship data | `/anex debug relationships` |

### Narrative Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/anex summon timeline` | Show event timeline | `/anex summon timeline` |
| `/anex summon mysteries` | Show active mysteries | `/anex summon mysteries` |
| `/anex summon secrets` | Show character secrets | `/anex summon secrets` |
| `/anex summon summary` | Show session summary | `/anex summon summary` |

### Update Commands (Future Feature)

| Command | Description | Example |
|---------|-------------|---------|
| `/anex update emotions` | Update emotions from AI | `/anex update emotions` |
| `/anex update resources` | Update resources from AI | `/anex update resources` |
| `/anex update all` | Update all modules | `/anex update all` |

## Tracked Modules

### Emotions
- happiness, anger, anxiety, trust, fear, joy, sadness, pride, shame

### Resources
- will, regulation, focus, energy, social

### Goals
- G_Seek_Connection
- G_Avoid_Vulnerability
- G_Test_Trustworthiness
- G_Maintain_Safety

### Beliefs
- P_Will_Abandon
- P_Genuine_Care
- P_Hidden_Agenda
- P_Deserving_Love
- trust_level

### Trauma
- betrayal
- abandonment
- emotional_neglect
- shame_based_abuse

### Relationships
- trust
- intimacy
- bond_strength
- power_dynamic

## Style Profile Format

Each style profile (`styles/*.json`) contains:

```json
{
  "name": "Style Name",
  "description": "Character archetype description",
  "emotions": {
    "emotion_name": {
      "baseline": 0.0-1.0,
      "current": 0.0-1.0,
      "decay": 0.0-1.0,
      "volatility": 0.0-2.0
    }
  },
  "resources": {
    "resource_name": {
      "current": number,
      "max": number,
      "recovery": number
    }
  },
  "personality_traits": {
    "trait_name": 0.0-1.0
  }
}
```

## Storage

The extension uses **chatMetadata** for per-chat storage by default, with automatic fallback to **extensionSettings** (global storage) if chatMetadata is unavailable.

Data structure:
```javascript
{
  anex: {
    style: "rina-kent",
    initialized: "2025-01-01T00:00:00Z",
    emotions: { ... },
    resources: { ... },
    goals: { ... },
    beliefs: { ... },
    trauma: { ... },
    relationships: { ... },
    narrative: {
      timeline: [],
      mysteries: [],
      secrets: {}
    }
  }
}
```

## Troubleshooting

### Extension Not Loading

1. Check console for errors (F12 → Console)
2. Verify all files are in the correct directory
3. Restart SillyTavern
4. Run `/anex test` to diagnose issues

### Commands Not Working

1. Make sure extension is enabled in Extensions menu
2. Check that you're using the correct command syntax
3. Run `/anex help` to see available commands

### Storage Issues

1. The extension automatically handles storage failures
2. If chatMetadata fails, it falls back to global storage
3. Run `/anex test` to see current storage mode

## Roadmap

### v1.0 (Current)
- ✅ Basic command structure
- ✅ Style profile system
- ✅ Storage management
- ✅ Debug display commands

### v1.1 (Next)
- [ ] Automatic AI response parsing
- [ ] Update commands that trigger AI generation
- [ ] Real-time state tracking
- [ ] UI panel for live monitoring

### v1.2 (Future)
- [ ] Visualization graphs
- [ ] Export/import data
- [ ] Custom style profile editor
- [ ] Advanced narrative tracking

## Contributing

Contributions welcome! Please:
1. Test thoroughly with ANEX_C prompt
2. Follow existing code style
3. Update README for new features
4. Submit pull requests with clear descriptions

## Credits

- ANEX_C Prompt Framework by [Original Creator]
- Extension Development by [Your Name]
- Style Profiles based on author writing styles

## License

[Choose your license - MIT, GPL, etc.]

## Support

For issues and questions:
- GitHub Issues: [Your Repo URL]
- SillyTavern Discord: #extensions channel

---

**Note**: This extension is designed to work with the ANEX_C prompt framework. Ensure you have ANEX_C properly configured in your SillyTavern prompts for best results.
