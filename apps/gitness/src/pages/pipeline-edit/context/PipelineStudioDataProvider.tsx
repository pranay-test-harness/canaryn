import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isEmpty, isUndefined } from 'lodash-es'
import { Skeleton } from '@harnessio/canary'
import { useYamlEditorContext } from '@harnessio/yaml-editor'
// import CreatePipeline from 'pages/CreatePipeline/CreatePipeline'
import { countProblems, monacoMarkers2Problems } from '../utils/problems-utils'
import type { YamlProblemSeverity } from '../types/types'
import type { InlineActionArgsType } from '../utils/inline-actions'
import { deleteItemInArray, injectItemInArray, updateItemInArray } from '../utils/yaml-utils'
import { Problem } from '@harnessio/playground'
import { TypesPlugin } from '../types/api-types'
import {
  OpenapiGetContentOutput,
  TypesPipeline,
  useFindPipelineQuery,
  useGetContentQuery
} from '@harnessio/code-service-client'
import { useParams } from 'react-router-dom'
import { decodeGitContent, normalizeGitRef } from '../../../utils/git-utils'

// TODO: temp interface for params
export interface PipelineParams extends Record<string, string> {
  spaceId: string
  repoId: string
  pipelineId: string
}

export const NEW_PIPELINE_IDENTIFIER = '-1'

export interface YamlRevision {
  yaml: string
  revisionId?: number
}

interface PipelineStudioDataContextProps {
  isDirty: boolean
  isExistingPipeline: boolean
  //
  isYamlValid: boolean
  yamlRevision: YamlRevision
  setYamlRevision: (yamlRevision: YamlRevision) => void
  //
  problems: {
    problems: Problem[]
    problemsCount: Record<YamlProblemSeverity | 'all', number>
  }
  // TODO: check if this should be here
  setAddStepIntention: (props: { path: string; position: InlineActionArgsType['position'] }) => void
  clearAddStepIntention: () => void
  addStepIntention: { path: string; position: InlineActionArgsType['position'] } | null
  setEditStepIntention: (props: { path: string }) => void
  clearEditStepIntention: () => void
  editStepIntention: { path: string } | null
  //
  requestYamlModifications: {
    injectInArray: (props: {
      path: string
      position: 'first' | 'last' | 'after' | 'before' | undefined
      item: unknown
    }) => void
    updateInArray: (props: { path: string; item: unknown }) => void
    deleteInArray: (props: { path: string }) => void
  }
  //
  setCurrentStepFormDefinition: (data: TypesPlugin | null) => void
  currentStepFormDefinition: TypesPlugin | null
  //
  pipelineData: TypesPipeline | undefined
  pipelineYAMLFileContent: OpenapiGetContentOutput | undefined
  fetchPipelineYAMLFileContent?: ReturnType<typeof useGetContentQuery>['refetch']
  fetchingPipelineYAMLFileContent?: boolean
}

const PipelineStudioDataContext = createContext<PipelineStudioDataContextProps>({
  isDirty: false,
  isExistingPipeline: false,
  isYamlValid: true,
  yamlRevision: { yaml: '', revisionId: 0 },
  setYamlRevision: (_yamlRevision: YamlRevision) => undefined,
  //
  problems: { problems: [], problemsCount: { all: 0, error: 0, info: 0, warning: 0 } },
  //
  setAddStepIntention: (_props: { path: string; position: InlineActionArgsType['position'] } | null) => undefined,
  clearAddStepIntention: () => undefined,
  addStepIntention: null,
  //
  setEditStepIntention: (_props: { path: string } | null) => undefined,
  clearEditStepIntention: () => undefined,
  editStepIntention: null,
  //
  requestYamlModifications: {
    injectInArray: (_props: {
      path: string
      position: 'first' | 'last' | 'after' | 'after' | 'before' | undefined
      item: unknown
    }) => undefined,
    updateInArray: (_props: { path: string; item: unknown }) => undefined,
    deleteInArray: (_props: { path: string }) => undefined
  },
  //
  setCurrentStepFormDefinition: (_data: TypesPlugin | null) => undefined,
  currentStepFormDefinition: null,
  //
  pipelineData: undefined,
  pipelineYAMLFileContent: undefined
})

const PipelineStudioDataProvider = ({ children }: React.PropsWithChildren) => {
  const [isExistingPipeline, setIsExistingPipeline] = useState(false)

  // keep state and ref of current yaml
  const latestYaml = useRef('')
  const [yamlRevision, setYamlRevisionLocal] = useState<YamlRevision>({ yaml: '' })
  const setYamlRevision = useCallback(
    (yamlRevision: YamlRevision) => {
      latestYaml.current = yamlRevision.yaml
      setYamlRevisionLocal(yamlRevision)
    },
    [setYamlRevisionLocal]
  )

  // TODO: PipelineParams is used temporary
  const { pipelineId = '', repoId, spaceId } = useParams<PipelineParams>()
  const repoRef = `${spaceId}/${repoId}/+`

  const { data, isLoading: fetchingPipeline } = useFindPipelineQuery({
    pipeline_identifier: pipelineId,
    repo_ref: repoRef
  })
  // TODO: style and model does not match
  const pipelineData = (data as { content: unknown })?.content as TypesPipeline | undefined

  const {
    data: pipelineYAMLFileContentRaw,
    error: pipelineYAMLFileError,
    isLoading: fetchingPipelineYAMLFileContent,
    refetch: fetchPipelineYAMLFileContent
  } = useGetContentQuery(
    {
      path: pipelineData?.config_path ?? '',
      repo_ref: repoRef,
      queryParams: { git_ref: normalizeGitRef(pipelineData?.default_branch) ?? '' }
    },
    { enabled: !!pipelineData?.default_branch }
  )
  // TODO: style and model does not match
  const pipelineYAMLFileContent = (pipelineYAMLFileContentRaw as { content: unknown })?.content as
    | OpenapiGetContentOutput
    | undefined

  const decodedPipelineYaml = useMemo(() => {
    return decodeGitContent(pipelineYAMLFileContent?.content?.data)
  }, [pipelineYAMLFileContent?.content?.data])

  useEffect(() => {
    setIsExistingPipeline(!isEmpty(decodedPipelineYaml) && !isUndefined(decodedPipelineYaml))
  }, [decodedPipelineYaml])

  useEffect(() => {
    const yaml = decodeGitContent(pipelineYAMLFileContent?.content?.data)
    setYamlRevision({ yaml })
  }, [pipelineYAMLFileContent?.content?.data, setYamlRevision])

  const [addStepIntention, setAddStepIntention] = useState<{
    path: string
    position: InlineActionArgsType['position']
  } | null>(null)
  const clearAddStepIntention = () => {
    setAddStepIntention(null)
  }

  const [editStepIntention, setEditStepIntention] = useState<{
    path: string
  } | null>(null)
  const clearEditStepIntention = () => {
    setEditStepIntention(null)
  }

  const [currentStepFormDefinition, setCurrentStepFormDefinition] = useState<TypesPlugin | null>(null)

  const injectInArray = useCallback(
    (injectData: { path: string; position: 'after' | 'before' | 'first' | 'last' | undefined; item: unknown }) => {
      const yaml = injectItemInArray(latestYaml.current, injectData)
      setYamlRevision({ yaml: yaml })
    },
    [clearAddStepIntention]
  )

  const updateInArray = useCallback(
    (injectData: { path: string; item: unknown }) => {
      const yaml = updateItemInArray(latestYaml.current, injectData)
      setYamlRevision({ yaml: yaml })
    },
    [clearAddStepIntention]
  )

  const deleteInArray = useCallback((data: { path: string }) => {
    const yaml = deleteItemInArray(latestYaml.current, data)
    setYamlRevision({ yaml: yaml })
  }, [])

  const requestYamlModifications = useMemo(
    () => ({
      injectInArray,
      deleteInArray,
      updateInArray
    }),
    [injectInArray, deleteInArray, updateInArray]
  )

  const { markers } = useYamlEditorContext()

  const problemsData = useMemo(() => {
    const problems = monacoMarkers2Problems(markers)
    const problemsCount = countProblems(problems)
    return {
      problems,
      problemsCount
    }
  }, [markers])

  const isYamlValid = useMemo(() => problemsData.problemsCount.error === 0, [problemsData])

  const isDirty = useMemo(() => {
    return decodeGitContent(pipelineYAMLFileContent?.content?.data) !== yamlRevision.yaml
  }, [yamlRevision.yaml, pipelineYAMLFileContent?.content?.data])

  console.log(isDirty, 'isDirty')
  // if (!isLoading && !yamlRevision.yaml) {
  //   return (
  //     <CreatePipeline
  //       setYaml={(aiYaml: string) => {
  //         setYamlRevision({ yaml: aiYaml })
  //       }}
  //     />
  //   )
  // }

  if (pipelineYAMLFileError) {
    // TODO
    return <>Something went wrong</>
  }

  if (fetchingPipelineYAMLFileContent || fetchingPipeline) {
    return (
      <div className="flex flex-col flex-1 gap-2 px-4 py-3 h-full items-center justify-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
    )
  }

  return (
    <PipelineStudioDataContext.Provider
      value={{
        isDirty,
        isExistingPipeline,
        //
        isYamlValid,
        yamlRevision,
        setYamlRevision,
        //
        problems: problemsData,
        //
        addStepIntention,
        setAddStepIntention,
        clearAddStepIntention,
        editStepIntention,
        setEditStepIntention,
        clearEditStepIntention,
        //
        requestYamlModifications,
        //
        currentStepFormDefinition,
        setCurrentStepFormDefinition,
        //
        pipelineData,
        pipelineYAMLFileContent,
        fetchPipelineYAMLFileContent,
        fetchingPipelineYAMLFileContent
      }}>
      {children}
    </PipelineStudioDataContext.Provider>
  )
}

export default PipelineStudioDataProvider

export const usePipelineDataContext = () => {
  return React.useContext(PipelineStudioDataContext)
}