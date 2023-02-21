import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Prec, Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';

interface LatexAlgoSettings{
	algorithmTitle_toggle:boolean;
	ioLoops_toggle:boolean;
	ensure_toggle:boolean;
	forLoops_toggle:boolean;
	whileLoops_toggle:boolean;
	ifElse_toggle:boolean;
	state_toggle:boolean;
	switchCase_toggle:boolean;
	fastIndentation_toggle: boolean;
	return_toggle: boolean;
}

const DEFAULT_SETTINGS: LatexAlgoSettings ={
	  algorithmTitle_toggle: true,
	  ioLoops_toggle: true,
	  ensure_toggle: true,
	  forLoops_toggle: true,
	  whileLoops_toggle: true,
	  ifElse_toggle: true,
	  state_toggle: true,
	  switchCase_toggle: true,
	  fastIndentation_toggle: true,
	return_toggle: true,
}

export default class LatexAlgorithms extends Plugin {
	settings: LatexAlgoSettings;

	async onload() {
		console.log("Loading Latex Algorithms")
		// check if the user is inside latex brackets conditional statement
		this.registerEditorExtension(this.makeExtension());
		await this.loadSettings();
		this.addSettingTab(new LatexAlgorithmsSetting(this.app, this));
		
	}

	onunload() {
		console.log("Closing Latex Algorithms")

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	private readonly withinMath = (
		editor: Editor
	): Boolean => {
		// check if cursor within $$
		const position = editor.getCursor()
		const current_line = editor.getLine(position.line);
		let cursor_index = position.ch
		let from = 0;
		let found = current_line.indexOf('$', from);
		while (found != -1 && found < cursor_index) {
			let next_char = editor.getRange(
				{ line: position.line, ch: found + 1 },
				{ line: position.line, ch: found + 2 })
			let prev_char = editor.getRange(
				{ line: position.line, ch: found - 1 },
				{ line: position.line, ch: found })
			if (next_char == '$' || prev_char == '$' || next_char == ' ') {
				from = found + 1;
				found = current_line.indexOf('$', from);
				continue;
			} else {
				from = found + 1;
				let next_found = current_line.indexOf('$', from);
				if (next_found == -1) {
					return false;
				} else if (cursor_index > found && cursor_index <= next_found) {
					return true;
				} else {
					from = next_found + 1;
					found = current_line.indexOf('$', from);
					continue;
				}
			}
		}

		const document_text = editor.getValue();
		cursor_index = editor.posToOffset(position);
		from = 0;
		found = document_text.indexOf('$$', from);
		let count = 0;
		while (found != -1 && found < cursor_index) {
			count += 1;
			from = found + 2;
			found = document_text.indexOf('$$', from);
		}
		return count % 2 == 1;
	};
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

class LatexAlgorithmsSetting extends PluginSettingTab {
	plugin: LatexAlgorithms;

	constructor(app: App, plugin: LatexAlgorithms) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'LaTeX Algorithms - Settings'});

		new Setting(containerEl)
		.setName("Fast indentation")
		.setDesc("SHIFT + TAB will indent the current line by 4 spaces.")
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.fastIndentation_toggle)
			.onChange(async (value) => {
				this.plugin.settings.fastIndentation_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}));

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
