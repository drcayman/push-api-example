const fs       = require('fs')
const http     = require('request')
const exists   = require('fs-exists-sync')
const colors   = require('colors')
const inquirer = require('inquirer')

const templateReadme = res => {

	let today = new Date(),
			d = today.getDate(),
			m = today.getMonth() + 1,
			y = today.getFullYear();

	if( d < 10 ) d = '0' + d
	if( m < 10 ) m = '0' + m

	today = `${d}.${m}.${y}`

	return `
### ${res.name}
_${res.url}_
- - - -

> **Erstellt von:** ${res.created_by.toUpperCase()}\x20\x20
> **Angelegt am:** ${today}\x20\x20
> **Server:** ${res.server}\x20\x20
> **Typ:** ${res.type}\x20\x20

**Notizen:**
${res.notes}
`
}


let questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Projektname'.green + '*'.red,
        validate(value) {
            if( value.length ) return true
            return 'Name is necessary.'.red
        }
    },
    {
        type: 'list',
        name: 'type',
        message: 'Projekttyp'.green,
        choices: [
            new inquirer.Separator('1) Static'),
            'HTML',
            'Jekyll',
            new inquirer.Separator('2) Server Side'),
            'PHP',
            'Ruby',
            'NodeJS',
            new inquirer.Separator('3) CMS'),
            'Joomla',
            'Typo3',
            'WordPress',
            new inquirer.Separator('4) App'),
            'Vue',
            'Mobile',
            'Laravel',
            'React'
        ]
    },
    {
        name: 'url',
        message: 'URL'.green,
        validate(value) {

            let pattern = value.match(/^https?:\/\//)
            if( pattern || value.length === 0 ) return true

            return 'Must be valid URL.'.red
        }
    },
    {
        type: 'list',
        name: 'server',
        message: 'Server'.green,
        choices: [
            'Oltrepo',
            'Canevino',
            'Netcup',
            'Mail2'
        ]
    },
	{
	    type: 'editor',
	    name: 'notes',
	    message: 'Write your notes.'
	}
]

inquirer.prompt(questions)
	.then(res => {

		let user = process.env.USER || process.env.USERNAME // Mac || Win

		if( user == 'hubert' ) user = 'hh'
		else if( user == 'lisa' ) user = 'ld'

		res.created_by = user

		fs.writeFile('./README.md', templateReadme(res), () => {
			console.log('README.md created.'.green)
			console.log('Open to write notes.'.yellow)
		})


		//uploadToDroplet(res)


	})
	.catch(err => console.log(err))



function uploadToDroplet(res) {
	//http.post('https://droplet.artofmyself.com', res)
}
