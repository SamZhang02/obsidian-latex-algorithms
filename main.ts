import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

interface LatexAlgoSettings{
  algorithmTitle_toggle:boolean;
  ioLoops_toggle:boolean;
  ensure_toggle:boolean;
  forLoops_toggle:boolean;
  whileLoops_toggle:boolean;
  ifElse_toggle:boolean;
  state_toggle:boolean;
  switchCase_toggle:boolean;
}

const DEFAULT_SETTINGS: LatexAlgoSettings ={
	  algorithmTitle_toggle: true,
	  ioLoops_toggle: true,
	  ensure_toggle: true,
	  forLoops_toggle: true,
	  whileLoops_toggle: true,
	  ifElse_toggle: true,
	  state_toggle: true,
	  switchCase_toggle: true
}

export default class MyPlugin extends Plugin {
	settings: LatexAlgoSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'LaTeX Algorithms - Settings'});

		new Setting(containerEl)
		.setName('Automatic Title for Algorithm')
		.setDesc('Typing /Algo will automatically generate a title for an algorithm block')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.algorithmTitle_toggle)
			.onChange(async (value) => {
				this.plugin.settings.algorithmTitle_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}));
		
		new Setting(containerEl)
		.setName('Automatic Input/Output subtitles')
		.setDesc('Typing /Input or /Output will automatically generate an input/output subtitle.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.ioLoops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.ioLoops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Ensure subtitle')
		.setDesc('Typing /Ensure will automatically generate an ensure subtitle.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.ensure_toggle)
			.onChange(async (value) => {
				this.plugin.settings.ensure_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic For Loops')
		.setDesc('Typing /For will automatically generate a for loop.' + ' End the loop with /EndFor.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.forLoops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.forLoops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic While Loops')
		.setDesc('Typing /While will automatically generate a while loop.' + ' End the loop with /EndWhile.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.whileLoops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.whileLoops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic If/ElseIf/Else')
		.setDesc('Typing /If, /ElseIf, /Else will automatically generate the approriate conditional statement.' + ' End the statement with /End<statement>.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.ifElse_toggle)
			.onChange(async (value) => {
				this.plugin.settings.ifElse_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic /State')
		.setDesc('Typing /State will automatically generate a state block.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.state_toggle)
			.onChange(async (value) => {
				this.plugin.settings.state_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Switch/Case/Default')
		.setDesc('Typing /Switch, /Case, /Default will automatically generate the approriate conditional statement.' + ' End the statement with /End<statement>.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.switchCase_toggle)
			.onChange(async (value) => {
				this.plugin.settings.switchCase_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));
	}
}
