import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Prec, Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';

interface LatexAlgoSettings{
	algorithmTitle_toggle:boolean;
	ioLoops_toggle:boolean;
	ensure_toggle:boolean;
	Loops_toggle:boolean;
	ifElse_toggle:boolean;
	state_toggle:boolean;
	switchCase_toggle:boolean;
	fastIndentation_toggle: boolean;
	return_toggle: boolean;
	proofs_toggle: boolean;
}

const DEFAULT_SETTINGS: LatexAlgoSettings ={
	algorithmTitle_toggle: true,
	ioLoops_toggle: true,
	ensure_toggle: true,
	Loops_toggle: true,
	ifElse_toggle: true,
	state_toggle: true,
	switchCase_toggle: true,
	fastIndentation_toggle: true,
	return_toggle: true,
	proofs_toggle: true,

}

export default class LatexAlgorithms extends Plugin {
	settings: LatexAlgoSettings;
	lversion = this.manifest.version;

	private readonly makeExtension = (): Extension => Prec.high(keymap.of([
		{
			key: "Space",
			run: () :boolean => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;

				const editor  = view.editor;
				if (!this.withinMath(editor)) return false;

				const cursorPlace = editor.getCursor();
				const line = editor.getLine(cursorPlace.line)
				const commandCutoff = this.getCommand(line.slice(0,cursorPlace.ch));

				if (commandCutoff === null) return false;

				const command = line.slice(commandCutoff, cursorPlace.ch);
				switch (command) {
					case "\\Algorithm":	
						if (this.settings.algorithmTitle_toggle){
							editor.replaceRange(`\\textbf{Algorithm } \\text{}`, {line:cursorPlace.line, ch:commandCutoff}, {line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:26 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Input":
						if (this.settings.ioLoops_toggle){
							editor.replaceRange("\\textbf{Input: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Output":
						if (this.settings.ioLoops_toggle){
							editor.replaceRange("\\textbf{Output: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Ensure":
						if (this.settings.ensure_toggle){
							editor.replaceRange("\\textbf{Ensure: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\State":
						if (this.settings.state_toggle){
							editor.replaceRange("\\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:6 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\For":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{For } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:20 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\While":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{While } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:22 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
						
					case "\\EndFor":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{end for}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:16 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndWhile":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{end while}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:18 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Continue":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{continue}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:17 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Break":
						if (this.settings.Loops_toggle){
							editor.replaceRange("\\textbf{break}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:14 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\If":
						if (this.settings.ifElse_toggle){
							editor.replaceRange("\\textbf{If } \\text{} \\textbf{ then:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:19 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Else":
						if (this.settings.ifElse_toggle){
							editor.replaceRange("\\textbf{Else:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:15 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\ElseIf":
						if (this.settings.ifElse_toggle){
							editor.replaceRange("\\textbf{Else if } \\text{} \\textbf{then:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndIf":
						if (this.settings.ifElse_toggle){
							editor.replaceRange("\\textbf{end if}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:15 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					case "\\Switch":
						if (this.settings.switchCase_toggle){
							editor.replaceRange("\\textbf{Switch } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Case":
						if (this.settings.switchCase_toggle){
							editor.replaceRange("\\textbf{Case } \\text{} \\textbf{:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:21 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\Default":
						if (this.settings.switchCase_toggle){
							editor.replaceRange("\\textbf{Default } \\text{} \\textbf{:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					
					case "\\Return":
						if (this.settings.return_toggle){
							editor.replaceRange("\\textbf{return } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndSwitch":
						if (this.settings.switchCase_toggle){
							editor.replaceRange("\\textbf{end switch}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:19 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Theorem":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textbf{Theorem: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:25 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Lemma":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textbf{Lemma: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Corollary":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textbf{Corollary: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:27 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Definition":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textbf{Definition: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:28 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Remark":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textbf{Remark: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Proof":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\textit{Proof. } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\QED":
						if (this.settings.proofs_toggle){
							editor.replaceRange("\\text{QED}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:10 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					default:
						editor.replaceSelection(" ");
				}
				return true;
			}
		},
		{
			key: "Shift-Tab",
			run: () :boolean => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;

				const editor = view.editor;
				if (!this.withinMath(editor)) return false;

				editor.replaceSelection("\\quad ");
				return true;
			}

		}
	]));

	async onload() {
		console.log("Loading Latex Algorithms")
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

	private getCommand = (str:string) => {
		for (let i = str.length-1;i>= 0; i--){
			if (str[i] === "\\") {
				return i;
			}
		}
		return null;
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

class LatexAlgorithmsSetting extends PluginSettingTab {
	plugin: LatexAlgorithms;

	constructor(app: App, plugin: LatexAlgorithms) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h1', {text: 'LaTeX Algorithms'});
		containerEl.createEl('h2', {text: 'Key Settings'});

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
		.setDesc('Typing \\Algorithm will automatically generate a title for an algorithm block')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.algorithmTitle_toggle)
			.onChange(async (value) => {
				this.plugin.settings.algorithmTitle_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}));
		
		new Setting(containerEl)
		.setName('Automatic Input/Output subtitles')
		.setDesc('Typing \\Input, \\Output or \\Ensure will automatically generate the appropriate subtitle.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.ioLoops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.ioLoops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Proof Keywords')
		.setDesc('Automatic generation of proof keywords with commands such as \\Proof, \\Theorem, etc..')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.proofs_toggle)
			.onChange(async (value) => {
				this.plugin.settings.proofs_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Loops')
		.setDesc('Typing \\For or \\While will automatically generate a loop.' + ' End the loop with \\End<For/While>.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.Loops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.Loops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Conditionals')
		.setDesc('Typing \\If, \\ElseIf, \\Else will automatically generate the approriate conditional statement.' + ' End the statement with \\EndIf.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.ifElse_toggle)
			.onChange(async (value) => {
				this.plugin.settings.ifElse_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic \\State')
		.setDesc('Typing \\State will automatically generate a state block.')
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
		.setDesc('Typing \\Switch, \\Case, \\Default will automatically generate the approriate conditional statement.' + ' End the statement with \\End<Switch/Case/Default>.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.switchCase_toggle)
			.onChange(async (value) => {
				this.plugin.settings.switchCase_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

	containerEl.createEl('h2', {text: 'Information'});
		new Setting(containerEl)
		.setName("Version " + this.plugin.manifest.version)
		.setDesc('If you find an issue with the software or would like to contribute, visit the GitHub reposity of this plugin.')
		.addButton((button) => button
			.setButtonText('Take me there!')
			.setClass('mod-cta')
			.onClick(() => {
				window.open("https://www.github.com/SamZhang02/obsidian-latex-algorithms");
			}
		));

	containerEl.createEl('h2', {text: 'Support the developer!'});
		new Setting(containerEl)
		.setName('Buy me a coffee!')
		.setDesc('If you like this plugin, consider buying me a coffee!')
		.addButton((button) => button
			.setButtonText('Buy me a coffee!')
			.setClass('mod-cta')
			.onClick(() => {
				window.open('https://www.buymeacoffee.com/samzhang');
			}
		));
	}

}
