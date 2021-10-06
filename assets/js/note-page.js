import { NoteForm, NoteCard } from '/js/components/note-form.js';

document.addEventListener('DOMContentLoaded', (e) => {
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
        console.log(noteForm);
        noteForm.handleForm();
    });
});