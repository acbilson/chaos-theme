document.addEventListener('DOMContentLoaded', (e) => {
    class NoteCard {

        get epistemic() {
            return this.el.dataset.epistemic;
        }

        get folder() {
            return this.el.dataset.folder;
        }

        constructor(el) {
            this.el = el;
        }

        toggleVisibility(selectedEpistemic, selectedFolder) {
            const applyEpistemicFilter = selectedEpistemic !== 'all';
            const applyFolderFilter = selectedFolder !== 'all';

            if (applyEpistemicFilter && applyFolderFilter) {
                if (this.epistemic === selectedEpistemic &&
                    this.folder === selectedFolder) {
                        this.el.style.display = 'block';
                    }
                else {
                        this.el.style.display = 'none';
                }
            }
            else if (applyEpistemicFilter) {
                this.el.style.display = this.epistemic === selectedEpistemic ? 'block' : 'none';
            } else if (applyFolderFilter) {
                this.el.style.display = this.folder === selectedFolder ? 'block' : 'none';
            } else {
                this.el.style.display = 'block';
            }
        }
    }

    class NoteForm {

        get selectedEpistemic() {
            return Array.from(this.form.epistemicSelector.selectedOptions).map(o => o.value)[0];
        }

        get selectedFolder() {
            return Array.from(this.form.folderSelector.selectedOptions).map(o => o.value)[0];
        }

        constructor(form, notes) {
            this.form = form;
            this.notes = notes;
        }

        handleForm() {
            this.filterByEpistemic();
        }

        filterByEpistemic() {
            Array.from(this.notes).forEach(n => n.toggleVisibility(this.selectedEpistemic, this.selectedFolder));
        }
    }

    const form = document.notesForm;
    const notes = Array.from(document
            .getElementById('notes-list')
            .querySelectorAll('li'))
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