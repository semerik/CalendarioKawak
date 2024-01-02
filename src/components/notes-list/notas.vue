<template>
  <!-- Filtros -->
  <b-container class="mt-2">
    <b-row
      cols="1"
      cols-sm="2"
      cols-md="4"
      cols-lg="6"
      align-h="end"
      align-v="center"
    >
      <b-col>
        <label class="form-label">Filtrar por Título:</label>
        <b-form-input v-model="filtroTitulo" type="text" class="form-control" />
      </b-col>
      <b-col>
        <label class="form-label">Filtrar por Descripción:</label>
        <b-form-textarea
          v-model="filtroDescripcion"
          size="sm"
        ></b-form-textarea>
      </b-col>
      <b-col>
        <b-button
          variant="success"
          @click="filtrarNotas"
          class="btn btn-primary mt-2"
          >Filtrar</b-button
        >
      </b-col>
    </b-row>

    <b-row>
      <!-- Lista de Notas -->
      <ul v-if="notasMostradas.length > 0" class="list-group">
        <li
          v-for="nota in notasMostradas"
          :key="nota.id"
          class="list-group-item"
        >
          <h5 class="mb-1">{{ nota.title }}</h5>
          <p class="mb-1">Descripción: {{ nota.descripcion }}</p>
          <b-button
            @click="actualizarPorId(nota.id)"
            variant="outline-success"
            pill
            class="mt-2 ml-auto"
            >Actualizar</b-button
          >
        </li>
      </ul>
      <!-- Mensaje si no hay notas para mostrar -->
      <p v-if="notasMostradas.length === 0">
        No hay notas que coincidan con los filtros.
      </p>
    </b-row>

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
import { getNotas } from "@/config/firebase";

export default {
  data() {
    return {
      // Filtros
      filtroTitulo: "",
      filtroDescripcion: "",
      // Arreglo de todas las notas del usuario
      notas: [],
      // Arreglo para almacenar las notas después de aplicar filtros
      notasFiltradas: [],
      // Número de notas que se mostrarán por página
      notasPorPagina: 5,
      // Número de la página actual
      paginaActual: 1,
      email: "",
    };
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
  created() {
    this.email = this.$route.params.email;
    this.getNotas();
  },
  methods: {
    // Método para obtener todas las notas
    async getNotas() {
      try {
        // Obtener todas las notas del usuario y guardarlas en el array 'notas'

        const notasSnapshot = await getNotas(this.email);
        notasSnapshot.forEach((notaDoc) => {
          this.notas.push({
            id: notaDoc.id,

            ...notaDoc.data(),
          });
        });

        // Al inicio, mostrar todas las notas sin filtrar
        this.notasFiltradas = [...this.notas];
      } catch (error) {
        console.log("Error al obtener las notas:");
        console.log(error);
      }
    },

    // Método para aplicar filtros a las notas
    filtrarNotas() {
      this.notasFiltradas = this.notas.filter((nota) => {
        return (
          // Verifica si el título de la nota incluye el título del filtro
          (!this.filtroTitulo ||
            (nota.title &&
              nota.title
                .toLowerCase()
                .includes(this.filtroTitulo.toLowerCase()))) &&
          // Verifica si la descripción de la nota incluye la descripción del filtro
          (!this.filtroDescripcion ||
            (nota.descripcion &&
              nota.descripcion
                .toLowerCase()
                .includes(this.filtroDescripcion.toLowerCase())))
        );
      });

      // Al filtrar, regresar a la primera página
      this.cambiarPagina(1);
    },

    // Método para cambiar la página actual
    cambiarPagina(pagina) {
      this.paginaActual = pagina;
    },
    // Para cuando la actualizacion venga desde actualizar-nota
    actualizarPorId(id) {
      const rutaDestino = {
        name: "calendar",
        params: { email: this.email },
        query: { id },
      };

      this.$router.push(rutaDestino);
    },
  },
};
</script>

<style scoped>
/* Estilos de Bootstrap para una apariencia limpia */
.form-control {
  margin-bottom: 1rem;
}

.list-group-item {
  cursor: pointer;
}

.pagination {
  margin-top: 1rem;
}
</style>
