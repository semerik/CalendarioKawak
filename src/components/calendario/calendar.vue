<template >
  <div>
    <!-- fila de home -->
    <b-row class="kawakBlue text-light">
      <b-col class="m-5">
        <p class="h1">Calendario kawak</p>
        <p class="h3 mt-4">Prueba técnica</p>
        <p class="mt-3">
          Esta aplicación web fue desarrollada con Vue2/Cli como prueba técnica
          para Kawak. Espero les guste,<br />
          La aplicación se ha diseñado con BootstrapVue,<br />
          la gestión de notas está hecha con Firebase y la navegación por
          routerLink.<br />
        </p>
        <p>
          * Para agregar una nota seleccione la fecha que quiere en el
          calendario y rellene los campos. <br />
          * Se mostraran todas las notas que tiene al final de la pagina. <br />
          * Para filtrar las notas, elija la fecha que ha seleccionado
          previamente en el calendario o vaya a notas desde la navbar.<br />
        </p>
        <b-button href="#calendario" variant="warning" id="calendario"
          >Ir al calendario</b-button
        >
        <b-button href="#actualizarNota" variant="success" id="calendario"
          >Ir a actualizar notas</b-button
        >
      </b-col>
      <b-col align-self="center">
        <b-img
          id="logo"
          :src="require('@/assets/logo-kawak.svg')"
          class="d-none d-md-block"
        ></b-img>
      </b-col>
    </b-row>

    <!-- fila de calendario -->
    <b-row class="kawakOrange p-4" align-h="center">
      <!-- columna de calendario -->
      <b-col class="col-md-4" align-self="center">
        <b-calendar @context="onContext" block locale="en-US"></b-calendar>
      </b-col>

      <!-- columna card del calendario -->
      <b-col align-self="center">
        <b-card
          header="Añadir nota"
          :title="form.date"
          header-bg-variant="warning"
          :footer="form.fechaCreada + ': ' + form.hora"
          border-variant="ligth"
          goo
          class="mt-2 mb-2"
        >
          <b-form @submit.prevent="agregarNota">
            <b-form-group label="Titulo" label-for="title">
              <b-form-input
                v-model="form.title"
                placeholder="Escriba el titulo"
                id="title"
                required
              />
            </b-form-group>

            <b-form-group label="Descripcion" label-for="descripcion">
              <b-form-textarea
                v-model="form.descripcion"
                placeholder="Escriba la descripcion"
                id="descripcion"
              />
            </b-form-group>

            <b-form-group label="Etiquetas" label-for="tags-pills">
              <b-form-tags
                input-id="tags-pills"
                v-model="form.tags"
                tag-variant="primary"
                size="lg"
                placeholder="Incluye tus etiquetas tus etiquetas"
              ></b-form-tags>
            </b-form-group>

            <b-button class="mt-3" type="submit" variant="primary"
              >Añadir Nota</b-button
            >
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <!-- Componente para mostrar las notas -->
    <div id="actualizarNota"></div>
    <actualizarNota :context="context" />
  </div>
</template>

<script>
import { setNote } from "@/config/firebase";
import actualizarNota from "./actualizar-nota.vue";

export default {
  created() {
    this.email = this.$route.params.email;
  },
  components: {
    actualizarNota,
  },
  data() {
    return {
      // Context es el objeto que devuelve calendar
      context: null,
      email: String.trim,
      //EL form para agregar una nota
      form: {
        date: "Seleccione una fecha",
        title: "",
        descripcion: "",
        tags: [],
        fechaCreada: "",
        hora: "",
      },
    };
  },

  methods: {
    // Metodo del calendario
    onContext(ctx) {
      const id = this.$route.query.id;
      if (id !== null && id !== undefined && id !== "") {
        this.context = {
          ...ctx, // Copia todas las propiedades existentes
          id: id, // Pasar el id
        };
        this.obtenerHoraActual();
        console.log(this.context);
      } else {
        this.context = ctx;
        this.form.date = `${this.context.activeYMD || "Ninguna"}`;
        this.obtenerHoraActual();
      }
    },
    async agregarNota() {
      try {
        const datos = {
          title: this.form.title,
          date: this.form.date,
          descripcion: this.form.descripcion,
          tags: this.form.tags,
          hora: this.form.hora,
          fechaCreada: this.form.fechaCreada,
        };

        await setNote(this.email, datos);

        this.form.title = "";
        this.form.descripcion = "";
        this.form.tags = [];
      } catch (error) {
        console.log(error);
      }
    },
    obtenerHoraActual() {
      const ahora = new Date();
      const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
      this.form.hora = ahora.toLocaleTimeString(undefined, opcionesHora);
      this.form.fechaCreada = ahora.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.kawakBlue {
  background: #644ce4;
}
.kawakOrange {
  background: #fc9c24;
}
#logo {
  filter: brightness(0) invert(1);
  margin-right: 20pt;
}
</style>