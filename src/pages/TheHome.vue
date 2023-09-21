<template>
  <div>
    <div class="container" v-show="statusJogo == 'inicio'">
    <h1>Digite o mais rápido que puder!</h1>
    <v-row>
      <v-col>
        <v-card class="pa-5">
          <div class="card-body">
            <h2 class="titulo">Iniciar jogo</h2>
            <form v-on:submit.prevent="iniciaJogo">
              <v-row>
                <v-col cols="12">
                  <input ref="focar" v-model="jogador" placeholder="Digite seu nome" class="inputclass nome" />
                </v-col>
                <v-col cols="12">
                  <p>Selecione a dificuldade</p>
                  <select v-model="dificuldade" class="inputclass select">
                    <option v-for="(dificuldade, index) in dificuldades" :value="index" :key="index">{{ dificuldade.nome }}</option>
                  </select>
                </v-col>
              </v-row>
            </form>
            <p class="small">Digite seu nome e aperte enter para começar!</p>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 h-100">
          <div class="card-body">
            <h2 class="titulo">Instruções</h2>
            <p>Esse é um jogo para ver quem digita mais rápido feito em vuezeira.</p>
            <ul class="list-group list-ordered">
              <ol class="list-group-item list-group-item-secondary">1. Digite o nome do jogador e pressione enter para iniciar.</ol>
              <ol class="list-group-item list-group-item-secondary">2. Prepare seus dedos!</ol>
              <ol class="list-group-item list-group-item-secondary">3. Vá digitando as frases que aparecem.</ol>
              <ol class="list-group-item list-group-item-secondary">4. Quanto mais rápido e mais frases digitar mais pontos fará.</ol>
              <ol class="list-group-item list-group-item-secondary">5. Após o tempo se esgotar, dependendo da sua pontuação você estará na lista de top 15.</ol>
            </ul>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
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
      <v-col cols="12" md="6">
        <v-card class="pa-5">
          <div class="card-body">
            <v-row>
              <v-col cols="12" md="6">
                <h2 class="titulo">Top 15</h2>
              </v-col>
              <v-col cols="12" md="6" class="text-md-right">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" @click="dialogClear = true">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </template>
                  <span>Limpar pontuação</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-dialog
              v-model="dialogClear"
              max-width="400"
            >
              <v-card class="card_dialog">
                <div class="text-center title_dialog">
                  Tem certeza que deseja limpar?
                </div>
                <v-row
                  class="border_dialog"
                  align="center"
                  justify="space-between"
                >
                  <v-btn
                    color="primary"
                    class="ui-btn-clean btn_dialog"
                    @click="dialogClear = false"
                  >
                    Não
                  </v-btn>
                  <v-btn
                    color="secondary"
                    class="ui-btn-clean btn_dialog"
                    @click="limparPontuacao()"
                  >
                    Sim
                  </v-btn>
                </v-row>
              </v-card>
            </v-dialog>
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
          <v-col cols="12" class="text-center">
            <h2 class="titulo text-center mb-3"><b>{{ fraseAtual.texto }}</b></h2>
            <input class="inputclass" onpaste="return false;" v-focus id="texto" ref="texto" :keyup="verificaDigitacao" :class="classeStatus" v-model="digitado">
          </v-col>
          <v-col cols="12" class="text-center area_dados">
            <p>Fase <b>{{ fase }}/{{ frases.length }}</b></p>
            <p>Pontos: <b>{{ pontuacao | formatNumber }}</b></p>
            <p :class="cronometro < 1000 ? 'texto-red' : ''"><v-icon>timer</v-icon> <b>{{ cronometro }}</b></p>
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
      dialogClear: false,
      timer: '',
      jogador: '',
      classeStatus: 'inputclass-info',
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
        { texto: 'Esse jogo é muito dahora', tempo: 450 },
        { texto: 'Três pratos de trigo para três tigres tristes', tempo: 500 },
        { texto: 'Quem chegou até aqui é bonzão', tempo: 500 },
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
          this.classeStatus = 'inputclass-success'
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
            this.classeStatus = 'inputclass-info'
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
            this.classeStatus = 'inputclass-success'
          } else {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.classeStatus = 'inputclass-danger'
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
    limparPontuacao: function () {
      localStorage.removeItem('placar')
      this.placarTodo = []
      this.dialogClear = false
      window.location.reload()
    },
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
        let todosPlacares = this.placarTodo
        let achou = false
        todosPlacares.filter((item) => {
          if (item.nome === this.jogador) {
            if (this.pontuacao > item.pontos) {
              item.pontos = this.pontuacao
              item.fase = this.fase
            }
            achou = true
          }
        })
        if (achou) {
          localStorage.setItem('placar', JSON.stringify(todosPlacares))
        } else {
          todosPlacares.push(pontuacaoAtual)
          localStorage.setItem('placar', JSON.stringify(todosPlacares))
        }
        this.$root.SnackControl.open(this, {
          text: 'Fim de jogo!',
          color: 'success'
        })
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
.inputclass-success:focus{
  background-color: #9bee7a;
  border-color: #4cfc07;
}
.inputclass-danger:focus{
  background-color: #f5a4a4;
  border-color: #f71a1a;
}
.inputclass-info:focus{
  background-color: #a2daf7;
  border-color: #18aaf3;
}
.inputclass {
  border: 2px gray solid;
}
.row{
  margin-top: 0px;
  margin-bottom: 0px;
}
input {
  font-size: 30px;
  background: blue;
  padding: 10px;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
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
  margin: 0 auto;
  width: 650px;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
}
.titulo {
  font-size: 30px;
}
.area_dados {
  font-size: 20px;
}
.select {
  appearance: auto!important;
  min-width: 200px;
}
.texto-red {
  color: red!important;
}
.small {
  font-size: 18px;
}
.h-100 {
  height: 100%;
}
.title_dialog {
  font-size: 26px;
}
.card_dialog {
  background: #000;
  padding: 15px;
}
.border_dialog {
  border-top: 1px #7e7e7e solid;
  margin-top: 5px;
  padding: 15px 15px 0 15px;
}
</style>
