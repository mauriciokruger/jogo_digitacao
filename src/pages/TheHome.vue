<template>
  <div>
    <div class="container" v-show="statusJogo == 'inicio'">
    <h1>Jogo de digitação</h1>
    <v-row align="center">
      <v-col>
        <div class="card">
          <div class="card-body">
            <h2 class="titulo">Iniciar jogo</h2>
            <form v-on:submit.prevent="iniciaJogo">
              <div class="row">
                <div class="col">
                  <input ref="focar" v-model="jogador" placeholder="Nome" class="form-control nome" />
                </div>
                <div class="col">
                  <select v-model="dificuldade" class="form-control">
                    <option v-for="(dificuldade, index) in dificuldades" :value="index" :key="index">{{ dificuldade.nome }}</option>
                  </select>
                </div>

              </div>
            </form>
            <p class="small">Digite seu nome e aperte enter para começar!</p>
          </div>
        </div>
      </v-col>
      <v-col>
        <v-card class="pa-5">
          <div class="card-body">
            <h2 class="titulo">Instruções</h2>
            <p>Esse é um jogo para ver quem digita mais rápido feito em vuezeira.</p>
            <ul class="list-group list-ordered">
              <ol class="list-group-item list-group-item-secondary">1. Digite o nome do jogador e pressione enter parainiciar.</ol>
              <ol class="list-group-item list-group-item-secondary">2. Vá digitando as frases que aparecem.</ol>
              <ol class="list-group-item list-group-item-secondary">3. Quanto mais rápido e mais frases digitar mais pontos fará.</ol>
            </ul>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5">
          <div class="card-body">
            <h2 class="titulo">Frases</h2>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Frase</th>
                    <th>Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(frase, i) in frases" :key="i">
                    <td>{{ i+1 }}</td>
                    <td>{{ frase.texto }}</td>
                    <td>{{ (frase.tempo + dificuldadeAtual.tempoAdicional)/100 }}s</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5">
          <div class="card-body">
            <h2 class="titulo">Top 15</h2>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Fase</th>
                    <th>Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, j) in filterPlacar(dificuldadeAtual.nome)" :key="j">
                    <td>{{ ++j }}</td>
                    <td>{{ item.nome }}</td>
                    <td>{{ item.fase }}</td>
                    <td>{{ item.pontos | formatNumber }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div class="container_game" v-show="statusJogo == 'jogando'">
    <v-card class="pa-5">
      <div>
        <v-row justify="center">
          <v-col class="text-center">
            <h2 class="titulo text-center mb-3"><b>{{ fraseAtual.texto }}</b></h2>
            <input class="form-control" onpaste="return false;" v-focus id="texto" ref="texto" :keyup="verificaDigitacao" :class="classeStatus" v-model="digitado">
          </v-col>
          <v-col md="4">
            <p>Fase <b>{{ fase }}/{{ frases.length }}</b></p>
            <p>Pontos: <b>{{ pontuacao | formatNumber }}</b></p>
            <p><span class="oi oi-clock"></span> <b>{{ cronometro }}</b></p>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fase: 1,
      digitado: '',
      dificuldade: 0,
      timer: '',
      jogador: '',
      classeStatus: 'form-control-info',
      pontuacao: 0,
      cronometro: 0,
      statusJogo: 'inicio',
      placarTodo: [],
      frases: [
        { texto: 'Oi', tempo: 300 },
        { texto: 'Tudo bem?', tempo: 300 },
        { texto: 'Jogando um jogo', tempo: 350 },
        { texto: 'Digitando rápido', tempo: 350 },
        { texto: 'Bacon é vida', tempo: 400 },
        { texto: 'Papibaquígrafo', tempo: 400 },
        { texto: 'Ninho de mafagafos', tempo: 450 },
        { texto: 'Esse jogo é outra coisa', tempo: 450 },
        { texto: 'Três pratos de trigo para três tigres tristes', tempo: 500 },
        { texto: 'Quem chegou aqui é topson', tempo: 500 },
        { texto: 'Falta só essa frase para terminar tudo', tempo: 500 }
      ],
      dificuldades: [
        { nome: 'Noob', modificador: 0.01, tempoAdicional: 3000 },
        { nome: 'Fácil', modificador: 0.5, tempoAdicional: 1000 },
        { nome: 'Médio', modificador: 2, tempoAdicional: 500 },
        { nome: 'Difícil', modificador: 5, tempoAdicional: 0 }
      ]
    }
  },
  computed: {
    placares () {
      // eslint-disable-next-line no-undef
      return _.orderBy(this.placarTodo, 'pontos', 'desc')
    },
    // eslint-disable-next-line vue/return-in-computed-property
    verificaDigitacao () {
      if (this.digitado.length > 1) {
        if (this.digitado === this.fraseAtual.texto) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.classeStatus = 'form-control-success'
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.digitado = ''
          this.paraTimer()
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.pontuacao +=
            this.fraseAtual.texto.split(' ').length *
            this.cronometro *
            10 *
            this.dificuldadeAtual.modificador
          if (this.fase < this.frases.length) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.classeStatus = 'form-control-info'
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.fase++
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.cronometro +=
              this.fraseAtual.tempo + this.dificuldadeAtual.tempoAdicional
            this.iniciaTimer()
          } else {
            this.gameOver()
          }
        } else {
          if (
            this.digitado === this.fraseAtual.texto.substr(0, this.digitado.length)
          ) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.classeStatus = 'form-control-success'
          } else {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.classeStatus = 'form-control-danger'
          }
        }
      }
    },
    fraseAtual () {
      return this.frases[this.fase - 1]
    },
    dificuldadeAtual () {
      return this.dificuldades[this.dificuldade]
    }
  },
  methods: {
    iniciaJogo: function () {
      if (this.jogador !== '') {
        this.statusJogo = 'jogando'
        this.digitado = ''
        this.fase = 1
        this.cronometro =
          this.fraseAtual.tempo + this.dificuldadeAtual.tempoAdicional
        this.pontuacao = 0
        this.iniciaTimer()
      }
      return false
    },
    iniciaTimer: function () {
      const self = this
      this.timer = setInterval(function () {
        self.cronometro -= 1
        if (self.cronometro <= 0) {
          self.gameOver()
        }
      }, 1)
    },
    paraTimer: function () {
      clearInterval(this.timer)
    },
    gameOver: function () {
      clearInterval(this.timer)
      if (this.pontuacao > 0) {
        var pontuacaoAtual = {
          nome: this.jogador,
          pontos: this.pontuacao,
          fase: this.fase,
          dificuldade: this.dificuldadeAtual.nome
        }
        console.log(pontuacaoAtual)
        let todosPlacares = this.placarTodo
        todosPlacares.push(pontuacaoAtual)
        console.log(todosPlacares)
        localStorage.setItem('placar', JSON.stringify(todosPlacares))
      }
      this.jogador = ''
      this.statusJogo = 'inicio'
      setTimeout(() => {
        this.$refs.focar.focus()
      }, 100)
    },
    filterPlacar (dificuldade) {
      // eslint-disable-next-line no-undef
      return _.take(
        // eslint-disable-next-line no-undef
        _.filter(this.placares, item => {
          return item.dificuldade.indexOf(dificuldade) >= 0
        }),
        15
      )
    }
  },
  filters: {
    formatNumber: function (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  },
  directives: {
    focus: function (el) {
      el.focus()
    }
  },
  created () {
    let getPlacar = JSON.parse(localStorage.getItem('placar'))
    if (getPlacar) {
      this.placarTodo = JSON.parse(localStorage.getItem('placar'))
      console.log(this.placarTodo)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-control-success:focus{
  background-color: #dff0d8;
  border-color: #d0e9c6;
}
.form-control-danger:focus{
  background-color: #f2dede;
  border-color: #ebcccc;
}
.form-control-info:focus{
  background-color: #d9edf7;
  border-color: #bcdff1;
}
.row{
  margin-bottom: 30px;
}
input {
  font-size: 30px;
  background: blue;
  padding: 10px;
}
.nome {
  color: white;
  &::placeholder {
    color: white;
  }
}
select {
  background: white;
  padding: 10px;
  font-size: 30px;
}
.container_game {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
}
.titulo {
  font-size: 30px;
}
</style>
