/* IMPORTAR ARCHIVO EXCEL PARA CREAR TABLAS EN HTML */

// GENERAR ARRAY EN JS A PARTIR DE ARCHIVO EXCEL
let result;
let cantidad_participantes;

function arrayGenerator() {
	// Obtener el archivo seleccionado
	let file = document.querySelector("#file").files[0];

	// Separar el nombre del archivo por punto (.) para obtener su tipo
	let type = file.name.split('.');

	// Mostrar un alert en caso de que el archivo no sea un excel y detener la función
	if (type[type.length - 1] !== 'xlsx' && type[type.length - 1] !== 'xls') {
		alert ('Seleccione solo archivos de Excel para importar');
		return false;
	}

	const reader = new FileReader();
	reader.readAsBinaryString(file);
	reader.onload = (e) => {
		const data = e.target.result;
		const zzexcel = window.XLS.read(data, {
			type: 'binary'
 		});

		// Limpio el array cada vez que subo un archivo
 		result = [];

		// const result = []; Lo saqué de la función para usarlo luego para crear una tabla

		// Código para recorrer las hojas del excel e ir agregado sus contenidos en el array "result"
		for (let i = 0; i < zzexcel.SheetNames.length; i++) {
			const newData = window.XLS.utils.sheet_to_json(zzexcel.Sheets[zzexcel.SheetNames[i]]);
			result.push(...newData)
		}
		console.log('result', result);

		cantidad_participantes = result.length;
		console.log('cantidad_participantes', cantidad_participantes);

		const quantity_notification = document.getElementById("quantity_notification");
		quantity_notification.innerText = `¡Hay ${cantidad_participantes} participantes en el torneo!`;

		const users_per_group = document.getElementById("users_per_group");
		users_per_group.style.display = "block";
	}
}

document.querySelector("#file").addEventListener("change", arrayGenerator);


// CREAR TABLAS DE GRUPOS

let groups_generator_button = document.getElementById("groups_generator_button");
groups_generator_button.addEventListener("click", generateGroups);


let alfabeto = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

let colors = ["#2e6e70", "#5F02BC", "#80FB03", "#c40d24", "#0203BC", "#BF0076", "#FBFA03", "#03fbfa", "#cf2e2e"];

function generateGroups() {
	const groupsContainer = document.getElementById("groups_container");

	// Limpio el container del HTML
	groupsContainer.innerHTML = "";

	arrayGenerator();

	// Accedo a la cantidad de participantes por grupo
	let participantes_grupo = Number(document.getElementById("users_per_group_input").value);
	console.log("participantes_grupo", participantes_grupo);

	if(participantes_grupo === 0) {
		alert("Por favor, indique la cantidad de participantes por cada grupo.");
		return;
	}

	// Calculo la cantidad entera de grupos
	let grupos_enteros = Math.floor(cantidad_participantes / participantes_grupo);
	console.log("grupos enteros", grupos_enteros);

	// Calculo el residuo de la división anterior y determino si habrá un grupo adicional con menos participantes
	let residuo = cantidad_participantes % participantes_grupo;
	let grupos_residuo;
	if( residuo !== 0) {
		grupos_residuo = 1;
	} else {
		grupos_residuo = 0;
	}
	console.log("grupos residuo", grupos_residuo);

	// Calculo la cantidad total de grupos
	let grupos_totales = grupos_enteros + grupos_residuo;
	console.log("grupos totales", grupos_totales);

	// Ciclo para crear una tabla por cada grupo

	//Variable para cambiar de color
	let k = 0;

	for(let j=0; j<grupos_totales; j++) {
		const table = document.createElement("table");
		const thead = document.createElement("thead");
		const tbody = document.createElement("tbody");

		// Si llegué al final de array de colores, vuelvo al inicio
		if(k > colors.length-1) {
			k = 0;
		}
		let headColor = colors[k];

		thead.innerHTML = `
			<tr style="background-color: ${headColor};">
				<th class="group_name" colspan="2">
					GRUPO ${alfabeto[j]}
				</th>
			</tr>
			<tr style="background-color: ${headColor};">
				<th class="user_number_header">N°</th>
				<th class="user_name_header">Usuario</th>
			</tr>
		`;

		table.appendChild(thead);
		table.appendChild(tbody);

		// Ciclo para agregar al azar la cantidad de participantes determinada a cada grupo
		for(let i=0; i<participantes_grupo; i++) {
			if(cantidad_participantes === 0) {
				break;
			}
			let chosen_index = Math.floor(Math.random()*cantidad_participantes);
			let chosen_user = result[chosen_index];
			console.log('chosen_index', chosen_index);
			console.log('chosen_user', chosen_user);

			const tbodyRow = document.createElement("tr");
			tbodyRow.innerHTML = `
				<tr>
					<td class="user_number">${i+1}</td>
					<td class="user_name">${chosen_user.Usuario}</td>
				</tr>
			`

			tbody.appendChild(tbodyRow);
			
			// Elimio del array al participante elegido al azar
			result.splice(chosen_index, 1);
			console.log('result', result);
			cantidad_participantes = result.length;
			console.log('cantidad_participantes', cantidad_participantes);
		}
		k++;
		// Agrego todas las tablas al contenedor de HTML
		groupsContainer.appendChild(table);
	}
}