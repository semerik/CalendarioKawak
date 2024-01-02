<template>
  <b-container class="mt-3 mb-3" v-if="notasMostradas.length > 0">
    <!-- Diseño de actualziar nota -->
    <b-card v-for="nota in notasMostradas" :key="nota.id">
      <b-card-header
        header-text-variant="light"
        id="card-header"
        class="d-flex justify-content-between align-items-center"
      >
        <b-card-text class="h5 text-center"
          >Actualizar nota: {{ nota.date }}</b-card-text
        >
        <b-button
          :variant="nota.editandoNota ? 'danger' : 'light'"
          @click="toggleEditarNota(nota)"
        >
          {{ nota.verBody ? "Dejar de actualizar nota" : "Actualizar nota" }}
        </b-button>
      </b-card-header>
      <!-- card body -->
      <b-card-body v-if="nota.verBody" class="fade-transition">
        <b-form @submit.prevent="actualizarNota(nota)">
          <b-form-group label="Fecha" label-for="date">
            <b-form-datepicker
              id="date"
              v-model="nota.date"
              required
            ></b-form-datepicker>
          </b-form-group>

          <b-form-group label="Titulo" label-for="title">
            <b-form-input
              v-model="nota.title"
              placeholder="Escriba el titulo"
              id="title"
              required
            />
          </b-form-group>

          <b-form-group label="Descripcion" label-for="descripcion">
            <b-form-textarea
              v-model="nota.descripcion"
              placeholder="Escriba la descripcion"
              id="descripcion"
            />
          </b-form-group>

          <b-form-group label="Etiquetas" label-for="tags-pills">
            <b-form-tags
              input-id="tags-pills"
              v-model="nota.tags"
              tag-variant="primary"
              size="lg"
              placeholder="Incluye tus etiquetas tus etiquetas"
            ></b-form-tags>
            <span>{{ nota.tags }}</span>
          </b-form-group>

          <b-button class="mt-3" type="submit" variant="primary"
            >Actualizar</b-button
          >
        </b-form>
      </b-card-body>
      <b-card-footer
        ><b-card-footer>{{
          "Fecha y hora creada: " + nota.fechaCreada + " : " + nota.hora
        }}</b-card-footer></b-card-footer
      >
    </b-card>

    <!-- Paginación Bootstrap -->
    <nav aria-label="Navegación de página">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <a
            class="page-link"
            @click="cambiarPagina(paginaActual - 1)"
            aria-label="Anterior"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="pagina in paginas"
          :key="pagina"
          :class="{ active: pagina === paginaActual }"
        >
          <a class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: paginaActual === totalPaginas }"
        >
          <a
            class="page-link"
            @click="cambiarPagina(paginaActual + 1)"
            aria-label="Siguiente"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </b-container>
</template>

<script>
import { getNotas, updateNote } from "@/config/firebase";

export default {
  created() {
    this.email = this.$route.params.email;
    this.getNotas();
  },
  props: {
    context: Object,
  },
  data() {
    return {
      email: "",

      // Arreglo de todas las notas del usuario
      notas: [],
      // Arreglo para almacenar las notas después de aplicar filtros
      notasFiltradas: [],
      notasPorPagina: 5,
      // Número de la página actual
      paginaActual: 1,
    };
  },
  watch: {
    "context.activeYMD": "filtrarNotas",
  },
  computed: {
    // Cálculo del total de páginas necesarias para mostrar las notas
    totalPaginas() {
      return Math.ceil(this.notasFiltradas.length / this.notasPorPagina);
    },
    // Arreglo que contiene el número de cada página
    paginas() {
      const paginas = [];
      for (let i = 1; i <= this.totalPaginas; i++) {
        paginas.push(i);
      }
      return paginas;
    },
    // Arreglo de notas que se mostrarán en la página actual
    notasMostradas() {
      const inicio = (this.paginaActual - 1) * this.notasPorPagina;
      const fin = inicio + this.notasPorPagina;
      return this.notasFiltradas.slice(inicio, fin);
    },
  },
  methods: {
    //Cambiar el boton de nota
    toggleEditarNota(nota) {
      nota.verBody = !nota.verBody;
      nota.editandoNota = !nota.editandoNota;
    },
    async getNotas() {
      try {
        // Obtener todas las notas del usuario y guardarlas en el array 'notas'
        const notasSnapshot = await getNotas(this.email);
        notasSnapshot.forEach((notaDoc) => {
          this.notas.push({
            id: notaDoc.id,
            verBody: false,
            editandoNota: false,
            ...notaDoc.data(),
          });
        });

        // Al inicio, mostrar todas las notas sin filtrar si tiene id
        if (this.context.id !== undefined && this.context.id !== null) {
          this.filtrarNotas();
        } else {
          // Al inicio, mostrar todas las notas sin filtrar cuando no hay id
          this.notasFiltradas = [...this.notas];
        }
      } catch (error) {
        console.log("Error al obtener las notas:");
        console.log(error);
      }
    },

    // Método para aplicar filtros a las notas
    filtrarNotas() {
      if (this.context.id !== undefined && this.context.id !== null) {
        this.notasFiltradas = this.notas.filter((nota) => {
          return (
            // Verifica si la fecha de la nota incluye el título del filtro
            !this.context.id || (nota.id && nota.id.includes(this.context.id))
          );
        });
      } else {
        this.notasFiltradas = this.notas.filter((nota) => {
          return (
            // Verifica si la fecha de la nota incluye el título del filtro
            !this.context.activeYMD ||
            (nota.date &&
              nota.date
                .toLowerCase()
                .includes(this.context.activeYMD.toLowerCase()))
          );
        });
        this.cambiarPagina(1);
      }
    },
    cambiarPagina(pagina) {
      this.paginaActual = pagina;
    },

    async actualizarNota(nota) {
      try {
        const ahora = new Date();
        const opcionesHora = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

        const datos = {
          title: nota.title,
          date: nota.date,
          descripcion: nota.descripcion,
          tags: nota.tags,
          hora: (nota.hora = ahora.toLocaleTimeString(undefined, opcionesHora)),
          fechaCreada: (nota.fechaCreada = ahora.toLocaleDateString()),
        };

        await updateNote(this.email, nota.id, datos);
      } catch (error) {}
    },
  },
};
</script>

<style scoped>
#card-header {
  background-color: #8cf404;
}
</style>