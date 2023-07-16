/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F77712',
        isActive: '#B85F1B',
        coolGray: '#959CB6',
        btnBlue: '#349EFF',
        'btn-cancel': '#DDDDDD',
        aliceBlue: '#F3F6F9',
        inActive: '#F64E60',
        active: '#49D478',
        'btn-cancel': '#DDDDDD',
        'label-booked': '#EEE5FF',
        'label-collected': '#F5FFCE',
        'label-completed': '#C9F7F5',
        'label-incompleted': '#EEE5FF',
        'label-waiting-result': '#FFF4DE',
        'label-active': '#D7F9EF',
        'label-inactive': '#FFE2E5',
        'label-booked-text': '#8950FC',
        'label-collected-text': '#B0DC00',
        'label-completed-text': '#1BC5BD',
        'label-incompleted-text': '#8950FC',
        'label-waiting-result-text': '#FFA800',
        pattensBlue: '#D9ECFF',
        disabledItem: '#E6E6E6',
        'hover-btnBlue': '#008AEC',
        'hover-btnCancel': '#C6C6C6',
        'disabled-btn': '#D8DFE5',
        white: '#FFFFFF',
        'light-gray': '#FCFCFC',
        'light-shade': '#C9CFD6',
        'bumame-primary': '#F67612',
        'bumame-secondary': '#349EFF',
        'bumame-inactive': '#F64E60',
        'bumame-booked': '#8950FC',
        'bumame-collected': '#FFA800',
        'bumame-completed': '#1BC5BD',
        'bumame-gray': '#E0E0E0'
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
};
