document.addEventListener('DOMContentLoaded', (e) => {
    class NoteCard {

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

    class NoteForm {

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

    const form = document.notesForm;
    const notes = Array.from(document
            .getElementById('notes-list')
            .querySelectorAll('.note-card'))
        .map(el => new NoteCard(el));

    if (!form || !notes || notes.length === 0) {
        console.warn('failed to retrieve note-form data from page');
        console.warn({ form, notes });
        return;
    }
    const noteForm = new NoteForm(form, notes);

    document.notesForm.addEventListener('submit', (e) => {
        e.preventDefault(); // refreshes page w/o this
        noteForm.handleForm();
    });
});