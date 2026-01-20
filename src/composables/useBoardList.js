import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getBoardList,
  getBoardCount,
  getWithDiaryBoardList,
  getWithDiaryBoardCount
} from '@/api/index'

const PAGE_SIZE = 20

const normalizePage = (value) => {
  const numeric = Number(value ?? 1)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 1
}

export function useBoardList(boardName, options = {}) {
  const route = useRoute()
  const router = useRouter()

  const items = ref([])
  const totalCount = ref(0)
  const pageNum = ref(normalizePage(route.query?.pageNum))
  const searchWord = ref(options.initialSearch ?? '')
  const loading = ref(false)
  const roomIdRef = options.roomIdRef

  const fetchList = async () => {
    if (boardName === 'withDiary' && (!roomIdRef || !roomIdRef.value)) {
      items.value = []
      totalCount.value = 0
      return
    }

    loading.value = true
    const listPayload = {
      name: boardName,
      startRow: (pageNum.value - 1) * PAGE_SIZE,
      pageSize: PAGE_SIZE,
      searchWord: searchWord.value
    }

    try {
      if (boardName === 'withDiary') {
        listPayload.roomId = roomIdRef.value
        const [listRes, countRes] = await Promise.all([
          getWithDiaryBoardList(listPayload),
          getWithDiaryBoardCount(roomIdRef.value)
        ])
        items.value = listRes.data ?? []
        totalCount.value = countRes.data ?? 0
      } else {
        const [listRes, countRes] = await Promise.all([
          getBoardList(listPayload),
          getBoardCount({ name: boardName, searchWord: searchWord.value })
        ])
        items.value = listRes.data ?? []
        totalCount.value = countRes.data ?? 0
      }
    } catch (error) {
      console.error(`Failed to fetch board data for ${boardName}`, error)
      items.value = []
      totalCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = async (page) => {
    const nextPage = normalizePage(page)
    if (nextPage === pageNum.value) {
      await fetchList()
      return
    }
    pageNum.value = nextPage
    router.replace({ query: { ...route.query, pageNum: nextPage } })
    await fetchList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = async (keyword) => {
    searchWord.value = keyword ?? ''
    pageNum.value = 1
    router.replace({ query: { ...route.query, pageNum: 1 } })
    await fetchList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  watch(
    () => route.query.pageNum,
    (value) => {
      const nextPage = normalizePage(value)
      if (nextPage !== pageNum.value) {
        pageNum.value = nextPage
        fetchList()
      }
    }
  )

  if (roomIdRef) {
    watch(
      roomIdRef,
      () => {
        if (!roomIdRef.value) {
          items.value = []
          totalCount.value = 0
          return
        }
        pageNum.value = 1
        fetchList()
      },
      { immediate: true }
    )
  } else {
    fetchList()
  }

  return {
    items,
    totalCount,
    pageNum,
    searchWord,
    loading,
    pageSize: PAGE_SIZE,
    fetchList,
    handlePageChange,
    handleSearch
  }
}
