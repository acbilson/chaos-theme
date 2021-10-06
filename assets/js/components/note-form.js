export class NoteCard {

    get epistemic() {
        return this.el.dataset.epistemic;
    }

    constructor(el) {
        this.el = el;
    }

    selectEpistemic(selectedEpistemic) {
        this.el.style.display = this.epistemic === selectedEpistemic ? 'block' : 'none';
    }
}

export class NoteForm {

    get selectedEpistemic() {
        return Array.from(this.form.epistemicSelector.selectedOptions).map(o => o.value)[0];
    }

    constructor(form, notes) {
        this.form = form;
        this.notes = notes;
    }

    handleForm() {
        this.filterByEpistemic();
    }

    filterByEpistemic() {
        Array.from(this.notes).forEach(n => n.selectEpistemic(this.selectedEpistemic));
    }
}