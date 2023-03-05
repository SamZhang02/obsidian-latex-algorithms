import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Prec, Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';

interface LatexAlgoSettings{
	algorithmTitle_toggle:boolean;
	subtitles_toggle:boolean;
	loops_toggle:boolean;
	conditionals_toggle:boolean;
	fastIndentation_toggle: boolean;
	proofs_toggle: boolean;
}

const DEFAULT_SETTINGS: LatexAlgoSettings ={
	algorithmTitle_toggle: true,
	subtitles_toggle:true,
	loops_toggle: true,
	conditionals_toggle: true,
	fastIndentation_toggle: true,
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

				const cursorPlace = editor.getCursor();
				const line = editor.getLine(cursorPlace.line)
				const commandCutoff = this.getCommand(line.slice(0,cursorPlace.ch));

				if (commandCutoff === null) return false;

				const command = line.slice(commandCutoff, cursorPlace.ch);
				switch (command) {
					case "\\Algorithm":	
						if (this.settings.algorithmTitle_toggle){
							if (!this.withinMath(editor)) {
								editor.replaceRange(" ", {line:cursorPlace.line, ch:commandCutoff}, {line:cursorPlace.line, ch:cursorPlace.ch});
								editor.replaceSelection( "\n$$\\begin{align*}\\\\ \n&\\textbf{Algorithm } \\text{}\\\\ \n&\\textbf{Input: } \\text{}\\\\ \n&\\textbf{Output: } \\text{}\\\\ \n\\end{align*}$$")
								editor.setCursor({line:cursorPlace.line+2, ch:27});
							} 
							else{
							editor.replaceRange(`\\textbf{Algorithm } \\text{}`, {line:cursorPlace.line, ch:commandCutoff}, {line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:26 + commandCutoff});
							}
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Input":
						if (!this.withinMath(editor)) return false;
						if (this.settings.subtitles_toggle){
							editor.replaceRange("\\textbf{Input: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Output":
						if (!this.withinMath(editor)) return false;
						if (this.settings.subtitles_toggle){
							editor.replaceRange("\\textbf{Output: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Ensure":
						if (!this.withinMath(editor)) return false;
						if (this.settings.subtitles_toggle){
							editor.replaceRange("\\textbf{Ensure: } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\State":
						if (!this.withinMath(editor)) return false;
						if (this.settings.subtitles_toggle){
							editor.replaceRange("\\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:6 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\For":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{For } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:20 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\While":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{While } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:22 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
						
					case "\\EndFor":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{end for}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:16 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndWhile":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{end while}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:18 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Continue":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{continue}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:17 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Break":
						if (!this.withinMath(editor)) return false;
						if (this.settings.loops_toggle){
							editor.replaceRange("\\textbf{break}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:14 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\If":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{If } \\text{} \\textbf{ then:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:19 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Else":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{Else:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:15 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\ElseIf":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{Else if } \\text{} \\textbf{then:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndIf":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{end if}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:15 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Switch":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{Switch } \\text{} \\textbf{ do:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Case":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{Case } \\text{} \\textbf{:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:21 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\Default":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{Default } \\text{} \\textbf{:}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:24 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					
					case "\\Return":
						if (!this.withinMath(editor)) return false;
						if (this.settings.subtitles_toggle){
							editor.replaceRange("\\textbf{return } \\text{}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:23 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\EndSwitch":
						if (!this.withinMath(editor)) return false;
						if (this.settings.conditionals_toggle){
							editor.replaceRange("\\textbf{end switch}", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:19 + commandCutoff});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Theorem":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textbf{Theorem}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 19});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Lemma":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textbf{Lemma}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 17});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Corollary":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textbf{Corollary}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 21});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Definition":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textbf{Definition}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch:commandCutoff + 22});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Remark":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textbf{Remark}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 18});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;

					case "\\Proof":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\textit{Proof.}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 18});
						}
						else{
							editor.replaceSelection(" ");
						}
						break;
					
					case "\\QED":
						if (this.settings.proofs_toggle && !this.withinMath(editor)){
							editor.replaceRange("$\\text{QED}$ ", {line:cursorPlace.line, ch:commandCutoff},{line:cursorPlace.line, ch:cursorPlace.ch});
							editor.setCursor({line:cursorPlace.line, ch: commandCutoff + 13});

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
				console.log('test')
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;

				const editor = view.editor;
				if (!this.withinMath(editor)) return false;

				const currLine = editor.getLine(editor.getCursor().line);
				let cutOff = 0;

				while (currLine[cutOff] === "&") cutOff++;

				editor.setSelection({line:editor.getCursor().line, ch:cutOff});
				editor.replaceSelection("\\quad ");
				editor.setCursor({line:editor.getCursor().line, ch: cutOff}); 

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

		containerEl.createEl('h1', {text: 'LaTeX Proofs and Algorithms'});
		containerEl.createEl('h2', {text: 'Proofs'});

		new Setting(containerEl)
		.setName('Automatic Proof Keywords')
		.setDesc('Proof shortcuts are to be used outside of math mode. Automatic generation of proof keywords with shortcuts such as \\Proof, \\Theorem, etc...\n')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.proofs_toggle)
			.onChange(async (value) => {
				this.plugin.settings.proofs_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		containerEl.createEl('h2', {text: 'Algorithms'});

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
		.setDesc('Typing \\Algorithm within math mode will automatically generate a title for an algorithm block. Typing \\Algorithm outside of math mode will generate a small algorithm block template within a math block.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.algorithmTitle_toggle)
			.onChange(async (value) => {
				this.plugin.settings.algorithmTitle_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}));
		
		new Setting(containerEl)
		.setName('Automatic Subtitles')
		.setDesc('Typing \\Input, \\Output, \\Ensure, \\State will automatically generate the appropriate subtitle.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.subtitles_toggle)
			.onChange(async (value) => {
				this.plugin.settings.subtitles_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Loops')
		.setDesc('Typing \\For or \\While will automatically generate a loop.' + ' End the loop with \\End<For/While>.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.loops_toggle)
			.onChange(async (value) => {
				this.plugin.settings.loops_toggle= value;
				await this.plugin.saveData(this.plugin.settings);
				this.display();
			}
		));

		new Setting(containerEl)
		.setName('Automatic Conditionals')
		.setDesc('Typing \\If, \\ElseIf, \\Else; \\Switch, \\Case, \\Default will automatically generate the approriate conditional statement.')
		.addToggle((toggle) => toggle
			.setValue(this.plugin.settings.conditionals_toggle)
			.onChange(async (value) => {
				this.plugin.settings.conditionals_toggle= value;
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
