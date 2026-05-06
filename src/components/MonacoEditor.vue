<!-- components/MonacoEditor.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

declare type MonacoEnvironmentProps = {
  getWorker?: (workerId: string, label: string) => Worker;
} | undefined;

// Настройка воркеров для Vite
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

const props = withDefaults(defineProps<{
  modelValue: string
  language?: string
  theme?: string
  height?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}>(), {
  language: 'javascript',
  theme: 'vs-dark',
  height: '400px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'editorReady': [editor: monaco.editor.IStandaloneCodeEditor]
}>()

const editorContainer = ref<HTMLDivElement>()
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!editorContainer.value) return

  editorInstance = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    tabSize: 2,
    ...props.options,
  })

  // Отслеживание изменений
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance!.getValue()
    emit('update:modelValue', value)
  })

  emit('editorReady', editorInstance)
})

onBeforeUnmount(() => {
  editorInstance?.dispose()
})

// Реактивное обновление значения
watch(
    () => props.modelValue,
    (newValue) => {
      if (editorInstance && newValue !== editorInstance.getValue()) {
        editorInstance.setValue(newValue)
      }
    }
)

// Изменение языка
watch(
    () => props.language,
    (newLang) => {
      if (editorInstance) {
        monaco.editor.setModelLanguage(editorInstance.getModel()!, newLang)
      }
    }
)
</script>

<template>
  <div ref="editorContainer" :style="{ height }" />
</template>

<style scoped>
:deep(.monaco-editor) {
  border-radius: 8px;
  overflow: hidden;
}
</style>