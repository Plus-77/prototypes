const { createApp, ref, computed, reactive, nextTick, watch } = Vue
const { ElMessage, ElMessageBox } = ElementPlus

const tree = [
  { id: "hz", label: "杭州市", count: 620, children: [
    { id: "xh", label: "西湖区", count: 200, children: [
      { id: "xx", label: "西溪街道", count: 120 },
      { id: "bs", label: "北山街道", count: 80 }
    ]},
    { id: "yh", label: "余杭区", count: 420 }
  ]}
]
const devices = [
  { name: "西湖小区东门监控", node: "xx", shelf: true, biz: true, bizIds: ["school"], online: "在线", gov: "治理中", coord: "无", type: "枪机", vendor: "海康", unit: "文新派出所", area: "西溪街道", areaPath: "杭州市 / 西湖区 / 西溪街道", tags: "学校周边", install: "2024-05-01", warranty: "2027-05-01" },
  { name: "文三路交叉口北向", node: "", shelf: false, biz: false, online: "在线", gov: "未治理", coord: "无", type: "—", vendor: "—", unit: "—", area: "—", areaPath: "", tags: "—", install: "", warranty: "" },
  { name: "市府大楼球机", node: "xh", shelf: true, biz: false, online: "离线", gov: "治理中", coord: "有", type: "球机", vendor: "大华", unit: "北山派出所", area: "西湖区", areaPath: "杭州市 / 西湖区", tags: "—", install: "2023-08-12", warranty: "2026-08-12" },
  { name: "学校门口球机", node: "xx", shelf: true, biz: true, bizIds: ["school", "hospital"], online: "在线", gov: "已治理", coord: "有", type: "球机", vendor: "海康", unit: "文新派出所", area: "西溪街道", areaPath: "杭州市 / 西湖区 / 西溪街道", tags: "学校周边；医院周边", install: "2022-03-01", warranty: "2025-03-01" },
  { name: "文二路西口枪机", node: "xx", shelf: true, biz: false, online: "在线", gov: "治理中", coord: "无", type: "枪机", vendor: "海康", unit: "文新派出所", area: "西溪街道", areaPath: "杭州市 / 西湖区 / 西溪街道", tags: "—", install: "", warranty: "" },
  { name: "黄龙体育中心球机", node: "", shelf: false, biz: false, online: "在线", gov: "未治理", coord: "无", type: "球机", vendor: "大华", unit: "—", area: "—", areaPath: "", tags: "—", install: "", warranty: "" },
  { name: "北山路人行道", node: "bs", shelf: true, biz: false, online: "离线", gov: "治理中", coord: "有", type: "枪机", vendor: "宇视", unit: "北山派出所", area: "北山街道", areaPath: "杭州市 / 西湖区 / 北山街道", tags: "—", install: "2021-11-20", warranty: "2024-11-20" },
  { name: "仓前街道口", node: "yh", shelf: true, biz: true, bizIds: ["road"], online: "在线", gov: "已治理", coord: "有", type: "枪机", vendor: "海康", unit: "仓前派出所", area: "余杭区", areaPath: "杭州市 / 余杭区", tags: "重点路口", install: "2020-06-18", warranty: "2026-06-18" },
  { name: "留下小学南门", node: "xh", shelf: true, biz: true, bizIds: ["school"], online: "在线", gov: "治理中", coord: "无", type: "球机", vendor: "海康", unit: "留下派出所", area: "留下街道", areaPath: "杭州市 / 西湖区 / 留下街道", tags: "学校周边", install: "", warranty: "" },
  { name: "西溪湿地入口", node: "", shelf: false, biz: false, online: "在线", gov: "未治理", coord: "无", type: "—", vendor: "—", unit: "—", area: "—", areaPath: "", tags: "—", install: "", warranty: "" }
]
const treeCounts = {
  original: { hz: 620, xh: 200, xx: 120, bs: 80, yh: 420 },
  base: { hz: 340, xh: 120, xx: 72, bs: 48, yh: 220 },
  business: { hz: 60, xh: 30, xx: 22, bs: 8, yh: 30 }
}
const catalogStat = {
  original: { total: "620", done: "198", rate: "31.9%", ing: "258", todo: "164" },
  base: { total: "340", done: "149", rate: "43.8%", ing: "111", todo: "80" }
}
const bizCatalogs = [
  { id: "school", name: "学校周边专项", total: "60", done: "25", rate: "41.7%", ing: "20", todo: "15", tree: { hz: 60, xh: 30, xx: 22, bs: 8, yh: 30 } },
  { id: "road", name: "重点路口", total: "32", done: "12", rate: "37.5%", ing: "13", todo: "7", tree: { hz: 32, xh: 10, xx: 6, bs: 4, yh: 22 } },
  { id: "hospital", name: "医院周边", total: "18", done: "9", rate: "50.0%", ing: "6", todo: "3", tree: { hz: 18, xh: 16, xx: 10, bs: 6, yh: 2 } }
]
const nameTokens = ["{管理单位}", "{设备类型}", "{序号}", "{详细地址}", "{行政区域:区县}", "{行政区域:地市}", "{行政区域:省}", "{标签:一级分类}", "{标签:二级分类}", "{标签:叶子结点}"]
const unitTree = [
  { value: "sj", label: "市公安局", disabled: true, children: [
    { value: "xhfj", label: "西湖分局", disabled: true, children: [
      { value: "wx", label: "文新派出所" },
      { value: "bsps", label: "北山派出所" },
      { value: "lxps", label: "留下派出所" }
    ]},
    { value: "yhfj", label: "余杭分局", disabled: true, children: [
      { value: "cq", label: "仓前派出所" }
    ]}
  ]}
]
const areaOptions = [
  { value: "杭州市", label: "杭州市", children: [
    { value: "西湖区", label: "西湖区", children: [
      { value: "西溪街道", label: "西溪街道" },
      { value: "北山街道", label: "北山街道" },
      { value: "留下街道", label: "留下街道" }
    ]},
    { value: "余杭区", label: "余杭区", children: [
      { value: "仓前街道", label: "仓前街道" }
    ]}
  ]}
]
const areaProps = { checkStrictly: true, emitPath: true }
function scopeName(id) {
  if (id === "base") return "基础目录"
  const found = bizCatalogs.find(b => b.id === id)
  return found ? found.name : id
}
function previewOf(tpl) {
  const map = {
    "{管理单位}": "文新派出所",
    "{设备类型}": "枪机",
    "{序号}": "001",
    "{详细地址}": "文三路100号",
    "{行政区域:区县}": "西湖区",
    "{行政区域:地市}": "杭州市",
    "{行政区域:省}": "浙江省",
    "{标签:一级分类}": "重点区域",
    "{标签:二级分类}": "学校周边",
    "{标签:叶子结点}": "学校周边"
  }
  let text = tpl || ""
  Object.keys(map).forEach(key => { text = text.split(key).join(map[key]) })
  return text || "—"
}
const catalogRules = reactive([
  { scope: "base", scopeName: "基础目录", tpl: "{行政区域:区县}_{管理单位}_{设备类型}", preview: "西湖区_文新派出所_枪机", on: true },
  { scope: "school", scopeName: "学校周边专项", tpl: "{行政区域:区县}_{管理单位}_学校_{标签:叶子结点}", preview: "西湖区_文新派出所_学校_学校周边", on: true },
  { scope: "hospital", scopeName: "医院周边", tpl: "{行政区域:区县}_医院_{标签:叶子结点}", preview: "西湖区_医院_医院周边", on: false }
])
const nodeKids = { hz: ["xh", "xx", "bs", "yh"], xh: ["xh", "xx", "bs"], xx: ["xx"], bs: ["bs"], yh: ["yh"] }
const defaultFilters = ["name", "online", "gov", "coord", "type", "vendor", "unit", "area", "tag"]
const defaultCols = ["online", "gov", "coord", "type", "vendor", "unit", "area", "tag"]
const groupOf = {
  dash: "数据治理", devices: "数据治理", detail: "数据治理", coord: "数据治理", ai: "数据治理",
  area: "数据治理", unit: "数据治理", tag: "数据治理",
  tasks: "治理任务", work: "治理任务", govern: "治理任务", taskDetail: "治理任务", audit: "治理任务", group: "治理任务",
  catalog: "业务目录生成", catalogEdit: "业务目录生成"
}

function withOrg(nodes) {
  return nodes.map(n => {
    const children = n.children ? withOrg(n.children) : null
    const direct = (n.devices || []).length
    const total = direct + (children ? children.reduce((s, c) => s + c.total, 0) : 0)
    const node = Object.assign({}, n, { direct, total, leaf: !children })
    if (children) node.children = children
    return node
  })
}
function findOrg(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const hit = findOrg(n.children, id)
      if (hit) return hit
    }
  }
}
function pathOrg(nodes, id, acc) {
  const prev = acc || []
  for (const n of nodes) {
    const next = prev.concat(n)
    if (n.id === id) return next
    if (n.children) {
      const hit = pathOrg(n.children, id, next)
      if (hit) return hit
    }
  }
}
function filterLabelTree(nodes, kw) {
  if (!kw) return nodes
  const out = []
  nodes.forEach(n => {
    if (n.label.indexOf(kw) >= 0) { out.push(n); return }
    const kids = n.children ? filterLabelTree(n.children, kw) : []
    if (kids.length) out.push(Object.assign({}, n, { children: kids }))
  })
  return out
}
function filterOrgTree(nodes, kw, st) {
  const out = []
  nodes.forEach(n => {
    const kids = n.children ? filterOrgTree(n.children, kw, st) : []
    const statusOk = !st || (st === "on" ? n.on : !n.on)
    const hit = (!kw || n.label.indexOf(kw) >= 0) && statusOk
    if (hit || kids.length) out.push(Object.assign({}, n, { children: n.children ? kids : undefined }))
  })
  return out
}
function collectOrgDevices(n, acc) {
  const list = acc || []
  ;(n.devices || []).forEach(name => list.push({ name, at: n.label }))
  ;(n.children || []).forEach(c => collectOrgDevices(c, list))
  return list
}
const unitOrg = withOrg([
  { id: "psb", label: "市公安局", level: 1, on: true, children: [
    { id: "xhf", label: "西湖分局", level: 2, on: true, children: [
      { id: "wx", label: "文新派出所", level: 3, on: true, devices: ["西湖小区东门监控", "文三路交叉口北向", "学校门口球机"] },
      { id: "bs", label: "北山派出所", level: 3, on: true, devices: ["北山路球机", "宝石山入口"] },
      { id: "lx", label: "留下派出所", level: 3, on: false, devices: [] }
    ]},
    { id: "yhf", label: "余杭分局", level: 2, on: true, children: [
      { id: "cq", label: "仓前派出所", level: 3, on: true, devices: ["仓前街道球机"] }
    ]}
  ]}
])
const tagOrg = withOrg([
  { id: "ga", code: "GA", label: "公安", dict: true, maxLevel: 3, level: 1, on: true, builtin: true, children: [
    { id: "zafk", code: "GA01", label: "治安防控", level: 2, on: true, builtin: true, children: [
      { id: "campus", code: "GA0101", label: "校园周边", level: 3, on: true, builtin: true, devices: ["校园北门", "校园南门"] },
      { id: "school", code: "GA0102", label: "学校周边", level: 3, on: true, devices: ["学校门口球机", "文三路小学北门", "学军中学东门", "浙江大学玉泉校门"] }
    ]},
    { id: "place", code: "GA02", label: "重点场所", level: 2, on: true, builtin: true, children: [
      { id: "hospital", code: "GA0201", label: "医院周边", level: 3, on: true, devices: ["浙一医院门诊", "邵逸夫医院南门"] }
    ]}
  ]},
  { id: "cg", code: "CG", label: "城管", dict: true, maxLevel: 3, level: 1, on: true, builtin: true, children: [
    { id: "cg-city", code: "CG01", label: "市容市貌", level: 2, on: true, builtin: true, children: [
      { id: "cg-ad", code: "CG0101", label: "户外广告", level: 3, on: true, builtin: true, devices: [] }
    ]}
  ]},
  { id: "jt", code: "JT", label: "交通", dict: true, maxLevel: 4, level: 1, on: true, builtin: true, children: [
    { id: "jt-road", code: "JT01", label: "道路交通", level: 2, on: true, builtin: true, children: [
      { id: "road", code: "JT0101", label: "重点路口", level: 3, on: true, children: [
        { id: "cross", code: "JT010101", label: "交叉口", level: 4, on: true, devices: ["文三路交叉口北向", "天目山路交叉口"] }
      ]}
    ]}
  ]},
  { id: "sl", code: "SL", label: "水利", dict: true, maxLevel: 2, level: 1, on: true, builtin: true, children: [
    { id: "sl-river", code: "SL01", label: "河道", level: 2, on: true, builtin: true, devices: [] }
  ]},
  { id: "yj", code: "YJ", label: "应急", dict: true, maxLevel: 3, level: 1, on: true, builtin: true, children: [
    { id: "yj-risk", code: "YJ01", label: "风险点", level: 2, on: true, builtin: true, children: [
      { id: "yj-flood", code: "YJ0101", label: "易涝点", level: 3, on: true, builtin: true, devices: [] }
    ]}
  ]},
  { id: "ms", code: "MS", label: "民生", dict: true, maxLevel: 5, level: 1, on: true, builtin: true, children: [
    { id: "ms-live", code: "MS01", label: "生活服务", level: 2, on: true, builtin: true, children: [
      { id: "ms-market", code: "MS0101", label: "农贸市场", level: 3, on: true, children: [
        { id: "ms-stall", code: "MS010101", label: "摊位区", level: 4, on: true, children: [
          { id: "ms-gate", code: "MS01010101", label: "市场出入口", level: 5, on: true, devices: [] }
        ]}
      ]}
    ]}
  ]},
  { id: "zb", code: "ZB", label: "装备", dict: true, maxLevel: 3, level: 1, on: true, builtin: true, children: [
    { id: "zb-cam", code: "ZB01", label: "视频设备", level: 2, on: true, builtin: true, children: [
      { id: "zb-ball", code: "ZB0101", label: "球机", level: 3, on: true, builtin: true, devices: [] }
    ]}
  ]}
])
function dictOf(id) {
  const path = pathOrg(tagOrg, id) || []
  return path.find(item => item.dict) || null
}
function toSelectTree(nodes, maxLevel) {
  return nodes.map(n => {
    const cap = n.dict ? n.maxLevel : maxLevel
    const children = n.children ? toSelectTree(n.children, cap) : undefined
    const bindable = !n.dict && n.on && n.level >= cap
    const node = { value: n.id, label: n.label, disabled: !bindable }
    if (children) node.children = children
    return node
  })
}
const tagTree = toSelectTree(tagOrg, 3)
function aiCatalogTree(view) {
  function mapNodes(nodes) {
    return nodes.map(function (n) {
      const children = n.children && n.children.length ? mapNodes(n.children) : null
      const leaf = !children
      return { id: n.id, label: n.label, disabled: !!view || !n.on || !leaf, children: children || undefined }
    })
  }
  return mapNodes(tagOrg)
}
function aiLeafId(name) {
  let id = ""
  function walk(nodes) {
    nodes.forEach(function (n) {
      if (id) return
      if (n.children && n.children.length) walk(n.children)
      else if (n.label === name) id = n.id
    })
  }
  walk(tagOrg)
  return id
}
function aiExpandKeys(ids) {
  const keys = []
  function walk(nodes, ancestors) {
    nodes.forEach(function (n) {
      if (n.children && n.children.length) walk(n.children, ancestors.concat(n.id))
      else if (ids.indexOf(n.id) >= 0) {
        ancestors.forEach(function (id) {
          if (keys.indexOf(id) < 0) keys.push(id)
        })
      }
    })
  }
  walk(tagOrg, [])
  return keys
}

createApp({
  setup() {
    const hashPage = (location.hash || "").replace(/^#/, "").split("?")[0]
    const page = ref(groupOf[hashPage] ? hashPage : "apps")
    if (!groupOf[hashPage]) history.replaceState(null, "", location.pathname + location.search + "#apps")
    const top = ref(page.value === "apps" ? "" : groupOf[page.value])
    const treeKey = ref(1)
    const treeOpen = ref(true)
    const mode = ref("three")
    const catalog = ref("original")
    const bizId = ref("school")
    const keyword = ref("")
    const nodeId = ref("")
    const batchStep = ref(1)
    const batchScope = ref("filter")
    const batchField = ref("")
    const batchAction = ref("bind")
    const batchValue = ref("")
    const skipProtected = ref(true)
    const lockedChecked = ref([])
    const lockedFilter = ref([])
    const filterKeys = ref(defaultFilters.slice())
    const colKeys = ref(defaultCols.slice())
    const batchOpen = ref(false)
    const colOpen = ref(false)
    const nameOpen = ref(false)
    const ruleEditOpen = ref(false)
    const ruleMode = ref("create")
    const ruleIndex = ref(-1)
    const ruleForm = reactive({ scope: "", tpl: "", on: true })
    const checked = ref([])
    const lng = ref("")
    const lat = ref("")
    const gType = ref("枪机")
    const geoWarn = ref(false)
    const gName = ref("西湖小区东门监控")
    const unitId = ref("wx")
    const tagIds = ref(["school", "hospital"])
    const areaPath = ref(["杭州市", "西湖区", "西溪街道"])
    const coordIdx = ref(0)
    const coordLng = ref("")
    const coordLat = ref("")
    const naOpen = ref(false)
    const naReason = ref("车载或移动点位")
    const aiTab = ref("all")
    const aiOpen = ref(false)
    const aiMode = ref("confirm")
    const aiRow = ref(null)
    const aiTagNodes = ref([])
    const aiTagChecked = ref([])
    const aiTagExpanded = ref([])
    const aiTagKw = ref("")
    const aiTagTreeRef = ref(null)
    const aiTable = ref(null)
    const aiChecked = ref([])
    const aiSelectAll = ref(false)
    const aiCountSets = {
      original: { all: 1058, wait: 126, ing: 8, confirm: 34, done: 890 },
      base: { all: 640, wait: 72, ing: 5, confirm: 18, done: 545 },
      school: { all: 60, wait: 8, ing: 1, confirm: 4, done: 47 },
      road: { all: 32, wait: 6, ing: 1, confirm: 3, done: 22 },
      hospital: { all: 18, wait: 3, ing: 0, confirm: 2, done: 13 }
    }
    const aiScopeKey = computed(function () {
      if (mode.value !== "three" || catalog.value === "original") return "original"
      if (catalog.value === "base") return "base"
      return bizId.value
    })
    const aiCounts = computed(function () { return aiCountSets[aiScopeKey.value] || aiCountSets.original })
    const aiPool = reactive({
      wait: [
        { name: "文三路交叉口北向", code: "33010600001320000021", org: "西湖区 / 西溪街道", place: "文三路与学院路交叉口", tags: [], st: "待标注", online: "在线", time: "—", op: "start", bizIds: ["road"] },
        { name: "背街小巷 03", code: "33010600001320000022", org: "西湖区 / 西溪街道", place: "—", tags: [], st: "待标注", online: "离线", time: "—", op: "start", fail: true, bizIds: ["road"] },
        { name: "西湖小区东门监控", code: "33010600001320000011", org: "西湖区 / 西溪街道", place: "文三路 100 号", tags: [], st: "待标注", online: "在线", time: "—", op: "start", bizIds: ["school"] },
        { name: "北山路球机", code: "33010600001320000041", org: "西湖区 / 北山街道", place: "北山路", tags: [], st: "待标注", online: "在线", time: "—", op: "start", bizIds: ["hospital"] }
      ],
      ing: [
        { name: "市府大楼东门", code: "33010600001320000051", org: "西湖区 / 西溪街道", place: "市府大楼东门", tags: [], st: "标注中", online: "在线", time: "2026-10-29 21:05:12", op: "", bizIds: ["hospital"] },
        { name: "文三路南向", code: "33010600001320000052", org: "西湖区 / 西溪街道", place: "文三路", tags: [], st: "标注中", online: "离线", time: "2026-10-29 21:06:03", op: "", bizIds: ["road"] }
      ],
      confirm: [
        { name: "学校门口球机", code: "33010600001320000031", org: "西湖区 / 西溪街道", place: "学校门口", tags: ["学校周边", "医院周边"], st: "待确认", online: "在线", time: "2026-10-13 10:27:40", op: "confirm", bizIds: ["school", "hospital"], suggest: [{ dict: "重点区域", leaves: ["学校周边", "医院周边", "重点路口"], picked: ["学校周边", "医院周边"] }] },
        { name: "文三路人行横道", code: "33010600001320000032", org: "西湖区 / 西溪街道", place: "文三路人行横道", tags: ["交叉口"], st: "待确认", online: "在线", time: "2026-10-09 14:59:23", op: "confirm", bizIds: ["road"], suggest: [{ dict: "重点区域", leaves: ["交叉口"], picked: ["交叉口"] }] },
        { name: "宝石山入口", code: "33010600001320000033", org: "西湖区 / 北山街道", place: "宝石山入口", tags: ["交叉口"], st: "待确认", online: "离线", time: "2026-10-09 14:58:11", op: "confirm", bizIds: ["road"], suggest: [{ dict: "重点区域", leaves: ["交叉口"], picked: ["交叉口"] }] }
      ],
      done: [
        { name: "留下街道球机", code: "33010600001320000061", org: "西湖区 / 留下街道", place: "留下街道", tags: ["校园周边"], st: "已确认", online: "在线", time: "2026-10-13 10:27:40", confirmTime: "2026-10-13 10:27:40", op: "view", bizIds: ["school"], suggest: [{ dict: "公共安全", leaves: ["校园周边"], picked: ["校园周边"] }] },
        { name: "西溪湿地入口", code: "33010600001320000062", org: "西湖区 / 西溪街道", place: "西溪湿地入口", tags: ["交叉口", "校园周边"], st: "已确认", online: "在线", time: "2026-10-13 10:27:40", confirmTime: "2026-10-13 10:28:02", op: "view", bizIds: ["hospital"], suggest: [{ dict: "重点区域", leaves: ["交叉口"], picked: ["交叉口"] }, { dict: "公共安全", leaves: ["校园周边"], picked: ["校园周边"] }] }
      ]
    })
    const aiTagFilterIds = ref([])
    const aiRows = computed(function () {
      const wait = aiPool.wait.filter(aiInScope)
      const ing = aiPool.ing.filter(aiInScope)
      const confirmRows = aiPool.confirm.filter(aiInScope)
      const done = aiPool.done.filter(aiInScope)
      const base = aiTab.value === "all" ? wait.slice(0, 2).concat(ing.slice(0, 1), confirmRows.slice(0, 1), done.slice(0, 1)) : aiTab.value === "wait" ? wait : aiTab.value === "ing" ? ing : aiTab.value === "confirm" ? confirmRows : done
      const ids = aiTagFilterIds.value || []
      if (!ids.length) return base
      const labels = ids.map(function (id) {
        const node = findOrg(tagOrg, id)
        return node ? node.label : ""
      }).filter(Boolean)
      if (!labels.length) return base
      return base.filter(function (row) { return labels.some(function (label) { return (row.tags || []).indexOf(label) >= 0 }) })
    })
    function aiInScope(row) {
      if (mode.value !== "three" || catalog.value === "original") return true
      if (catalog.value === "base") return true
      return (row.bizIds || []).indexOf(bizId.value) >= 0
    }
    const aiSelectedCount = computed(function () { return aiSelectAll.value ? aiCounts.value[aiTab.value] : aiChecked.value.length })
    const aiCanSelect = computed(function () { return aiTab.value === "wait" || aiTab.value === "confirm" })
    function onAiTab() {
      aiChecked.value = []
      aiSelectAll.value = false
      aiTagFilterIds.value = []
    }
    watch([catalog, bizId], function () {
      aiChecked.value = []
      aiSelectAll.value = false
      aiTagFilterIds.value = []
    })
    const aiTreeBase = { hz: 620, xh: 200, xx: 120, bs: 80, yh: 420 }
    const aiTreeShelf = { hz: 340, xh: 110, xx: 64, bs: 46, yh: 230 }
    function aiTodoCount(data) {
      if (mode.value === "three" && catalog.value === "business") return (currentBiz.value.tree || {})[data.id] || 0
      if (mode.value === "three" && catalog.value === "base") return aiTreeShelf[data.id] || 0
      return aiTreeBase[data.id] || 0
    }
    function onAiSelect(rows) {
      aiChecked.value = rows
      if (rows.length !== aiRows.value.length) aiSelectAll.value = false
    }
    function aiPickPage() {
      aiSelectAll.value = false
      nextTick(function () {
        const table = aiTable.value
        if (!table) return
        table.clearSelection()
        aiRows.value.forEach(function (row) { table.toggleRowSelection(row, true) })
      })
    }
    function aiPickAll() {
      const table = aiTable.value
      if (!table) return
      table.clearSelection()
      aiRows.value.forEach(function (row) { table.toggleRowSelection(row, true) })
      nextTick(function () { aiSelectAll.value = true })
    }
    function aiScopeText() {
      const n = aiSelectedCount.value
      return aiSelectAll.value ? "当前筛选条件下全部 " + n + " 台" : "已选中 " + n + " 台"
    }
    function markAnnotating(row) {
      row.st = "标注中"
      row.op = ""
      row.fail = false
      row.time = "2026-10-29 22:50:00"
      const i = aiPool.wait.indexOf(row)
      if (i >= 0) {
        aiPool.wait.splice(i, 1)
        aiPool.ing.unshift(row)
      }
    }
    function startAi(row) {
      aiMode.value = "start"
      aiRow.value = row
      aiOpen.value = true
    }
    function runAiBatch() {
      const n = aiSelectedCount.value
      if (!n) return
      if (aiTab.value === "confirm") {
        ElMessage.success("已批量确认 " + n + " 台。建议全部写入，治理状态已重算")
        return
      }
      ElMessageBox.confirm("将对" + aiScopeText() + "发起标注。发起后状态变为标注中，处理完成后需人工确认。", "批量发起标注", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }).then(function () {
        aiChecked.value.forEach(markAnnotating)
        aiChecked.value = []
        aiSelectAll.value = false
        ElMessage.success("发起成功")
      }).catch(function () {})
    }
    function openAi(row) {
      const view = row.op === "view"
      aiMode.value = view ? "view" : "confirm"
      aiRow.value = row
      aiTagNodes.value = aiCatalogTree(view)
      aiTagChecked.value = (row.tags || []).map(aiLeafId).filter(Boolean)
      aiTagExpanded.value = aiExpandKeys(aiTagChecked.value)
      aiTagKw.value = ""
      aiOpen.value = true
    }
    function aiTagFilter(value, data) {
      if (!value) return true
      return data.label.indexOf(value) >= 0
    }
    function filterAiTree() {
      if (aiTagTreeRef.value) aiTagTreeRef.value.filter(aiTagKw.value)
    }
    function aiCheckedLabels() {
      const tree = aiTagTreeRef.value
      const ids = tree ? tree.getCheckedKeys() : []
      const labels = []
      function walk(nodes) {
        nodes.forEach(function (n) {
          if (n.children && n.children.length) walk(n.children)
          else if (ids.indexOf(n.id) >= 0) labels.push(n.label)
        })
      }
      walk(tagOrg)
      return labels
    }
    function submitAi() {
      const row = aiRow.value
      if (!row) return
      if (aiMode.value === "start") {
        markAnnotating(row)
        ElMessage.success("发起成功")
      } else if (aiMode.value === "confirm") {
        const picked = aiCheckedLabels()
        row.tags = picked
        row.st = "已确认"
        row.op = "view"
        row.confirmTime = "2026-10-29 22:50:00"
        const i = aiPool.confirm.indexOf(row)
        if (i >= 0) {
          aiPool.confirm.splice(i, 1)
          aiPool.done.unshift(row)
        }
        ElMessage.success("确认成功，治理状态已重算")
      }
      aiOpen.value = false
    }
    function aiStType(st) {
      if (st === "已确认") return "success"
      if (st === "标注中") return "info"
      return "warning"
    }
    const catMode = ref("area")
    const catName = ref("")
    const trunk = ref("area")
    const editing = ref(false)
    const changeOpen = ref(false)
    const assignOpen = ref(false)
    const assigned = ref("")
    const catStatus = ref("有变化")
    const oneOpen = ref(false)
    const oneField = ref("unit")
    const fillOpen = ref(false)
    const exportOpen = ref(false)
    const importOpen = ref(false)
    const imported = ref(false)
    const bindOpen = ref(false)
    const prefillOpen = ref(false)
    const zoomOpen = ref(false)
    const unbindOpen = ref(false)
    const queue = ref("todo")
    const advancedOpen = ref(false)
    const syncOpen = ref(false)
    const syncLogOpen = ref(false)
    const nodeOpen = ref(false)
    const taskCreateOpen = ref(false)
    const taskEditOpen = ref(false)
    const dispatchOpen = ref(false)
    const dispatchTask = ref(null)
    const taskPrefill = reactive({ unitId: "", areaId: "", addressDetail: "", deviceType: "", vendor: "", installDate: "", warrantyExpireDate: "", tagIds: "" })
    const taskItems = ref(["管理单位", "行政区划"])
    const taskEditName = ref("")
    const taskEditWho = ref(["李治理"])
    const taskEditItems = ref([])
    const taskEditCatalog = ref("")
    const taskCreateName = ref("")
    const taskCreateWho = ref(["李治理"])
    const taskCreateCatalog = ref("")
    const nameCatalogOptions = [
      { value: "base", label: "基础目录", scope: "base" },
      { value: "school", label: "业务目录 / 学校周边专项", scope: "business" },
      { value: "road", label: "业务目录 / 重点路口", scope: "business" },
      { value: "hospital", label: "业务目录 / 医院周边", scope: "business" }
    ]
    function catalogMeta(value) {
      return nameCatalogOptions.find(function (item) { return item.value === value }) || null
    }
    function catalogLabel(value) {
      const meta = catalogMeta(value)
      return meta ? meta.label : ""
    }
    function taskHasName(row) {
      if (!row || mode.value !== "three") return false
      return String(row.items || "").split("、").map(function (s) { return s.trim() }).indexOf("设备规范名称") >= 0
    }
    const editingTask = ref(null)
    function openTaskEdit(row) {
      editingTask.value = row
      taskEditName.value = row.name || ""
      taskEditWho.value = row.who ? String(row.who).split("、") : []
      taskEditItems.value = row.items ? String(row.items).split("、").map(function (s) { return s.trim() }).filter(Boolean) : []
      if (mode.value !== "three") taskEditItems.value = taskEditItems.value.filter(function (item) { return item !== "设备规范名称" })
      taskEditCatalog.value = row.nameCatalog || ""
      taskEditOpen.value = true
    }
    function openTaskCreate() {
      taskCreateName.value = ""
      taskCreateWho.value = ["李治理"]
      taskItems.value = ["管理单位", "行政区划"]
      taskCreateCatalog.value = ""
      taskCreateOpen.value = true
    }
    function saveTaskCreate() {
      const name = String(taskCreateName.value || "").trim()
      if (!name) { ElMessage.warning("任务名称不能为空"); return }
      if (!taskCreateWho.value.length) { ElMessage.warning("请选择治理人"); return }
      if (!taskItems.value.length) { ElMessage.warning("请至少选择一个治理项"); return }
      const hasName = taskItems.value.indexOf("设备规范名称") >= 0
      if (hasName && !taskCreateCatalog.value) {
        ElMessage.warning("请选择规范名称的生效目录")
        return
      }
      const now = new Date()
      const pad = function (n) { return (n < 10 ? "0" : "") + n }
      const stamp = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes())
      taskRows.unshift({
        id: Date.now() % 100000,
        code: "ZL" + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + pad(now.getHours()) + pad(now.getMinutes()),
        name: name,
        st: "草稿",
        who: taskCreateWho.value.join("、"),
        creator: "罗港",
        roles: ["创建人"],
        items: taskItems.value.join("、"),
        nameCatalog: hasName ? taskCreateCatalog.value : "",
        n: 0,
        boundIds: [],
        time: stamp,
        dispatched: false,
        scope: "",
        scopeFull: ""
      })
      taskCreateOpen.value = false
      ElMessage.success("创建成功")
    }
    function saveTaskEdit() {
      const row = editingTask.value
      if (!row) return
      const name = String(taskEditName.value || "").trim()
      if (!name) { ElMessage.warning("任务名称不能为空"); return }
      if (!taskEditItems.value.length) { ElMessage.warning("请至少选择一个治理项"); return }
      const hasName = taskEditItems.value.indexOf("设备规范名称") >= 0
      if (hasName && !taskEditCatalog.value) { ElMessage.warning("请选择规范名称的生效目录"); return }
      const hadName = taskHasName(row)
      if (row.n > 0 && (hasName !== hadName || (hasName && taskEditCatalog.value !== (row.nameCatalog || "")))) {
        ElMessage.warning("已有绑定设备，不能改规范名称或生效目录。请先移出设备")
        return
      }
      row.name = name
      row.who = (taskEditWho.value || []).join("、")
      row.items = taskEditItems.value.join("、")
      row.nameCatalog = hasName ? taskEditCatalog.value : ""
      if (row.prefill) {
        const keep = {}
        prefillOf(taskEditItems.value).forEach(function (field) {
          const value = row.prefill[field.key]
          if (value && !(Array.isArray(value) && !value.length)) keep[field.key] = value
        })
        row.prefill = keep
      }
      taskEditOpen.value = false
      ElMessage.success("已保存")
    }
    const taskRows = reactive([
      { id: 1, code: "ZL20261027001", name: "西湖区十月补录", st: "草稿", who: "李治理", creator: "罗港", roles: ["创建人"], items: "管理单位、行政区划、经纬度", n: 60, boundIds: ["s1", "s5", "s8", "s10", "o2", "o5"], time: "2026-10-27 09:12", dispatched: false, scope: "西溪街道 · 缺管理单位 · 球机", scopeFull: "原始目录 = 西溪街道；治理项缺失 = 管理单位；设备类型 = 球机；未派单，条件仅保存不生效" },
      { id: 2, code: "ZL20261026002", name: "学校周边专项", st: "已派发", who: "李治理", creator: "罗港", roles: ["创建人", "审核人"], items: "设备规范名称、业务标签、经纬度", nameCatalog: "school", n: 56, boundIds: ["s1", "s5", "s8", "s10"], time: "2026-10-26 16:40", dispatched: true, scope: "学校周边专项 · 缺规范名称/业务标签/经纬度 · 全部类型", scopeFull: "生效目录 = 业务目录 / 学校周边专项；治理项缺失 = 设备规范名称、业务标签、经纬度；设备类型 = 不限；坐标状态 = 不限；命中 56 台，已排除重复 2 台" }
    ])
    const taskItemKeyMap = {
      "设备规范名称": "standardName", "管理单位": "unitId", "行政区划": "areaId", "详细地址": "addressDetail",
      "设备类型": "deviceType", "设备厂商": "vendor", "安装日期": "installDate", "维保到期日": "warrantyExpireDate",
      "业务标签": "tagIds", "经纬度": "lngLat"
    }
    const activeGovTask = ref(taskRows[1])
    function openGovern(row) {
      if (row) activeGovTask.value = row
      const meta = row && taskHasName(row) ? catalogMeta(row.nameCatalog) : null
      if (meta) govScope.value = meta.scope
      go("govern", "治理任务")
    }
    const taskDetailTask = ref(null)
    taskDetailTask.value = taskRows[0]
    const taskDetailItems = computed(() => {
      const t = taskDetailTask.value
      return t && t.items ? String(t.items).split("、").map(function (s) { return s.trim() }).filter(Boolean) : []
    })
    const taskDetailQuery = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    const taskDetailApplied = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    function openTaskDetail(row) {
      taskDetailTask.value = row
      taskDetailQuery.name = ""
      taskDetailQuery.deviceId = ""
      taskDetailQuery.channelId = ""
      taskDetailQuery.status = ""
      taskDetailApplied.name = ""
      taskDetailApplied.deviceId = ""
      taskDetailApplied.channelId = ""
      taskDetailApplied.status = ""
      taskPage.value = 1
      go("taskDetail", "治理任务")
    }
    const taskDetailKeys = computed(() => taskDetailItems.value.map(function (l) { return taskItemKeyMap[l] }).filter(Boolean))
    const taskDetailBase = computed(() => {
      const t = taskDetailTask.value
      if (!t) return []
      const keys = taskDetailKeys.value
      const total = keys.length || 10
      return govDevices.slice(0, t.n).map(function (r) {
        const miss = t.dispatched ? keys.filter(function (k) {
          if (k === "standardName" && t.nameCatalog) return !String((r.catalogNames && r.catalogNames[t.nameCatalog]) || "").trim()
          return r.missing && r.missing[k]
        }) : []
        return {
          id: r.id,
          name: r.name,
          deviceId: r.deviceId,
          channelId: r.channelId,
          filled: t.dispatched ? total - miss.length : 0,
          total: total,
          status: t.dispatched ? r.status : "un",
          missingList: t.dispatched ? miss.map(function (k) { return govFieldLabels[k] || k }) : []
        }
      })
    })
    const taskDetailDevices = computed(() => taskDetailBase.value.filter(function (row) {
      if (taskDetailApplied.name && row.name.indexOf(taskDetailApplied.name) < 0) return false
      if (taskDetailApplied.deviceId && row.deviceId.indexOf(taskDetailApplied.deviceId) < 0) return false
      if (taskDetailApplied.channelId && row.channelId.indexOf(taskDetailApplied.channelId) < 0) return false
      if (taskDetailApplied.status && row.status !== taskDetailApplied.status) return false
      return true
    }))
    const taskDetailStats = computed(() => {
      const t = taskDetailTask.value
      const rows = taskDetailBase.value
      if (!t) return { total: 0, pending: 0, saved: 0, reviewing: 0, rejected: 0, completed: 0, undispatched: 0, rate: 0, dispatched: false }
      if (!t.dispatched) return { total: rows.length, pending: 0, saved: 0, reviewing: 0, rejected: 0, completed: 0, undispatched: rows.length, rate: 0, dispatched: false }
      const n = function (s) { return rows.filter(function (r) { return r.status === s }).length }
      const done = n("4")
      return { total: rows.length, pending: n("0"), saved: n("1"), reviewing: n("2"), rejected: n("3"), completed: done, undispatched: 0, rate: rows.length ? Math.round(done * 1000 / rows.length) / 10 : 0, dispatched: true }
    })
    const taskPage = ref(1)
    const taskPageSize = ref(10)
    const taskPagedView = computed(() => {
      const start = (taskPage.value - 1) * taskPageSize.value
      return taskDetailDevices.value.slice(start, start + taskPageSize.value)
    })
    function taskPageChange(p) { taskPage.value = p }
    function taskSizeChange(s) { taskPageSize.value = s; taskPage.value = 1 }
    function taskSearch() {
      taskDetailApplied.name = (taskDetailQuery.name || "").trim()
      taskDetailApplied.deviceId = (taskDetailQuery.deviceId || "").trim()
      taskDetailApplied.channelId = (taskDetailQuery.channelId || "").trim()
      taskDetailApplied.status = taskDetailQuery.status
      taskPage.value = 1
    }
    function taskReset() {
      taskDetailQuery.name = ""
      taskDetailQuery.deviceId = ""
      taskDetailQuery.channelId = ""
      taskDetailQuery.status = ""
      taskSearch()
    }
    function taskStatusText(row) {
      if (row.status === "un") return "未派发"
      return govStatusText[row.status] || "—"
    }
    function pickTaskStat(s) {
      if (!taskDetailStats.value.dispatched) return
      taskDetailQuery.status = taskDetailApplied.status === s ? "" : s
      taskSearch()
    }
    function clearTaskStat() {
      taskDetailQuery.status = ""
      taskSearch()
    }
    function csvCell(v) {
      const s = String(v == null ? "" : v)
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
    }
    function taskExport() {
      const rows = taskDetailDevices.value
      if (!rows.length) { ElMessage.warning("当前筛选结果为空，无可导出数据"); return }
      const head = ["原始设备名称", "平台编码", "通道编码", "字段进度", "缺失字段", "设备状态"]
      const lines = rows.map(function (r) {
        return [r.name, r.deviceId, r.channelId, r.filled + "/" + r.total, r.missingList.join("、") || "无", taskStatusText(r)].map(csvCell).join(",")
      })
      const csv = "\uFEFF" + [head.join(",")].concat(lines).join("\r\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = (taskDetailTask.value ? taskDetailTask.value.name : "治理任务") + "-设备进度.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      ElMessage.success("已导出 " + rows.length + " 台设备")
    }
    const prefillFields = [
      { key: "unitId", item: "管理单位", label: "管理单位", kind: "tree", options: "dcUnitTree" },
      { key: "areaId", item: "行政区划", label: "行政区划", kind: "cascader", options: "catRegionOptions" },
      { key: "deviceType", item: "设备类型", label: "设备类型", kind: "select", options: ["枪机","半球","球机","鹰眼","全景","梯半球","针孔"] },
      { key: "vendor", item: "设备厂商", label: "设备厂商", kind: "text" },
      { key: "installDate", item: "安装日期", label: "安装日期", kind: "date" },
      { key: "warrantyExpireDate", item: "维保到期日", label: "维保到期日", kind: "date" },
      { key: "tagIds", item: "业务标签", label: "业务标签", kind: "tree", options: "dcTagTree" },
      { key: "addressDetail", item: "详细地址", label: "详细地址", kind: "text" }
    ]
    function prefillOf(items) {
      return prefillFields.filter(function (f) { return (items || []).indexOf(f.item) >= 0 })
    }
    const areaCreateOpen = ref(false)
    const catOpen = ref(false)
    const workTab = ref("govern")
    const workRole = ref("")
    watch(workTab, function () { workRole.value = "" })
    const workRows = computed(() => {
      let list = taskRows
      if (workTab.value !== "all") list = list.filter(function (r) { return r.dispatched })
      if (workRole.value) list = list.filter(function (r) { return (r.roles || []).indexOf(workRole.value) >= 0 })
      return list
    })
    const workGovStats = computed(() => {
      const list = taskRows.filter(function (r) { return r.dispatched })
      const acc = { tasks: list.length, pending: 0, saved: 0, rejected: 0 }
      list.forEach(function (t) {
        govDevices.slice(0, t.n).forEach(function (r) {
          if (r.status === "0") acc.pending++
          else if (r.status === "1") acc.saved++
          else if (r.status === "3") acc.rejected++
        })
      })
      return acc
    })
    const memberOpen = ref(false)
    const governItems = ["设备规范名称", "管理单位", "行政区划", "详细地址", "设备类型", "设备厂商", "安装日期", "维保到期日", "业务标签", "经纬度"]
    const offerItems = computed(() => mode.value === "three" ? governItems : governItems.filter(item => item !== "设备规范名称"))
    const activeItemNames = computed(() => {
      const task = activeGovTask.value
      let items = task && task.items ? String(task.items).split("、").map(item => item.trim()).filter(Boolean) : governItems.slice()
      if (mode.value !== "three") items = items.filter(item => item !== "设备规范名称")
      return items
    })
    const activeItemKeys = computed(() => activeItemNames.value.map(name => taskItemKeyMap[name]).filter(Boolean))
    const dcOpen = ref(false)
    const dcDirExpand = ref(false)
    const dcTask = ref(null)
    const dcDir = ref("root")
    const dcDirLabel = ref("原始目录")
    const dcChecked = ref([])
    const dcTree = [
      { id: "root", label: "原始目录", children: [
        { id: "plat", label: "西湖视频平台", children: [
          { id: "xh", label: "西湖区", children: [
            { id: "xx", label: "西溪街道" },
            { id: "bs", label: "北山街道" }
          ]},
          { id: "yh", label: "余杭区" }
        ]}
      ]}
    ]
    const dcKids = { root: ["xx", "bs", "yh"], plat: ["xx", "bs", "yh"], xh: ["xx", "bs"], xx: ["xx"], bs: ["bs"], yh: ["yh"] }
    const baseTree = [
      { id: "root", label: "基础目录", children: [
        { id: "plat", label: "西湖视频平台", children: [
          { id: "xh", label: "西湖区", children: [
            { id: "xx", label: "西溪街道" },
            { id: "bs", label: "北山街道" }
          ]},
          { id: "yh", label: "余杭区" }
        ]}
      ]}
    ]
    const bizTree = [
      { id: "biz-root", label: "业务目录", children: [
        { id: "school", label: "学校周边专项" },
        { id: "road", label: "重点路口" },
        { id: "hospital", label: "医院周边" }
      ]}
    ]
    const scopeDirTree = computed(() => {
      const row = dcTask.value
      const meta = row && taskHasName(row) ? catalogMeta(row.nameCatalog) : null
      if (meta && meta.scope === "business") {
        const node = ((bizTree[0] && bizTree[0].children) || []).find(function (item) { return item.id === meta.value })
        return node ? [node] : bizTree
      }
      if (meta && meta.scope === "base") return baseTree
      if (dcFilters.scope === "base") return baseTree
      if (dcFilters.scope === "business") return bizTree
      return dcTree
    })
    const dcUnitTree = [
      { value: "sj", label: "市公安局", disabled: true, children: [
        { value: "xhfj", label: "西湖分局", disabled: true, children: [
          { value: "wx", label: "文新派出所" },
          { value: "bsps", label: "北山派出所" }
        ]}
      ]}
    ]
    const dcTagTree = tagTree
    const dcFilters = reactive({ name: "", deviceId: "", channelId: "", online: "", bind: "", unit: "", tags: [], area: "", missing: [], scope: "", dir: "" })
    const dcApplied = reactive({ name: "", deviceId: "", channelId: "", online: "", bind: "", unit: "", tags: [], area: "", missing: [], scope: "", dir: "" })
    const dcDevices = reactive([
      { id: "s1", dir: "xx", name: "西湖小区东门监控", deviceId: "33010600001320000001", channelId: "33010600001320000011", online: 1, unit: "文新派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s2", dir: "xx", name: "文三路小学南门", deviceId: "33010600001320000002", channelId: "33010600001320000012", online: 1, unit: "文新派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: true, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s3", dir: "xx", name: "翠苑小学东门", deviceId: "33010600001320000003", channelId: "33010600001320000013", online: 0, unit: "文新派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: true },
      { id: "s4", dir: "xx", name: "学军中学北门", deviceId: "33010600001320000004", channelId: "33010600001320000014", online: 1, unit: "—", tags: "—", area: "", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: true, missingArea: true, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: true, missingAddr: false },
      { id: "s5", dir: "bs", name: "北山中学东门", deviceId: "33010600001320000005", channelId: "33010600001320000015", online: 1, unit: "北山派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 北山街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: true, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s6", dir: "bs", name: "北山中学南门", deviceId: "33010600001320000006", channelId: "33010600001320000016", online: 0, unit: "北山派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 北山街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: true, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s7", dir: "yh", name: "求是小学球机", deviceId: "33011000001320000007", channelId: "33011000001320000017", online: 1, unit: "北山派出所", tags: "学校周边", area: "杭州市 / 余杭区", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: true, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s8", dir: "yh", name: "余杭实验学校门口", deviceId: "33011000001320000008", channelId: "33011000001320000018", online: 0, unit: "文新派出所", tags: "学校周边、医院周边", area: "杭州市 / 余杭区", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school", "hospital"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: true, missingTag: false, missingAddr: false },
      { id: "s9", dir: "xx", name: "海曙学校东门", deviceId: "33020300001320000009", channelId: "33020300001320000019", online: 1, unit: "文新派出所", tags: "学校周边", area: "宁波市 / 海曙区", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: true },
      { id: "s10", dir: "bs", name: "学校周边已拆除", deviceId: "33010600001320000010", channelId: "33010600001320000020", online: 0, unit: "北山派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 北山街道", bind: false, deleted: true, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s11", dir: "xx", name: "蒋村小学南门", deviceId: "33010600001320000011", channelId: "33010600001320000021", online: 1, unit: "文新派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "s12", dir: "xx", name: "留下小学西门", deviceId: "33010600001320000012", channelId: "33010600001320000022", online: 0, unit: "文新派出所", tags: "学校周边", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "school"], missingName: true, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "o1", dir: "xx", name: "文三路交叉口北向", deviceId: "33010600001320000013", channelId: "33010600001320000023", online: 0, unit: "—", tags: "—", area: "", bind: false, deleted: false, shelf: false, biz: false, bizIds: [], missingName: true, missingCoord: true, missingUnit: true, missingArea: true, missingType: true, missingVendor: true, missingInstall: true, missingWarranty: true, missingTag: true, missingAddr: true },
      { id: "o2", dir: "bs", name: "已拆除球机", deviceId: "33010600001320000014", channelId: "33010600001320000024", online: 0, unit: "北山派出所", tags: "—", area: "杭州市 / 西湖区 / 北山街道", bind: false, deleted: true, shelf: true, biz: false, bizIds: [], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: true, missingInstall: true, missingWarranty: true, missingTag: true, missingAddr: false },
      { id: "o3", dir: "yh", name: "仓前街道球机", deviceId: "33011000001320000015", channelId: "33011000001320000025", online: 1, unit: "仓前派出所", tags: "医院周边", area: "杭州市 / 余杭区", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "hospital"], missingName: false, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: true, missingWarranty: true, missingTag: false, missingAddr: false },
      { id: "o4", dir: "xx", name: "文二路重点路口", deviceId: "33010600001320000016", channelId: "33010600001320000026", online: 1, unit: "文新派出所", tags: "—", area: "杭州市 / 西湖区 / 西溪街道", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "road"], missingName: false, missingCoord: false, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: true, missingAddr: true },
      { id: "o5", dir: "yh", name: "浙大医院南门", deviceId: "33011000001320000017", channelId: "33011000001320000027", online: 1, unit: "北山派出所", tags: "医院周边", area: "杭州市 / 余杭区", bind: false, deleted: false, shelf: true, biz: true, bizIds: ["biz-root", "hospital"], missingName: false, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: false, missingAddr: false },
      { id: "o6", dir: "bs", name: "北山街道离线枪机", deviceId: "33010600001320000018", channelId: "33010600001320000028", online: 0, unit: "北山派出所", tags: "—", area: "杭州市 / 西湖区 / 北山街道", bind: false, deleted: false, shelf: true, biz: false, bizIds: [], missingName: true, missingCoord: true, missingUnit: false, missingArea: false, missingType: false, missingVendor: false, missingInstall: false, missingWarranty: false, missingTag: true, missingAddr: false }
    ])
    const dcView = computed(() => dcDevices.filter(row => {
      const dirs = dcKids[dcDir.value] || []
      if (dirs.indexOf(row.dir) < 0) return false
      const f = dcApplied
      if (f.name && row.name.indexOf(f.name) < 0) return false
      if (f.deviceId && row.deviceId.indexOf(f.deviceId) < 0) return false
      if (f.channelId && row.channelId.indexOf(f.channelId) < 0) return false
      if ((f.online === 0 || f.online === 1) && row.online !== f.online) return false
      if ((f.bind === true || f.bind === false) && row.bind !== f.bind) return false
      if (f.unit && row.unit.indexOf(unitName(f.unit)) < 0) return false
      if (f.area && row.area.indexOf(f.area) < 0) return false
      return true
    }))
    const dcCondView = computed(() => dcDevices.filter(row => {
      const f = dcApplied
      if (f.scope === "base" && !row.shelf) return false
      if (f.scope === "business" && !row.biz) return false
      if (f.dir) {
        if (f.scope === "business") {
          if (f.dir !== "biz-root" && (!row.bizIds || row.bizIds.indexOf(f.dir) < 0)) return false
        } else {
          const dirs = dcKids[f.dir] || []
          if (dirs.indexOf(row.dir) < 0) return false
        }
      }
      if (f.name && row.name.indexOf(f.name) < 0) return false
      if (f.deviceId && row.deviceId.indexOf(f.deviceId) < 0) return false
      if (f.channelId && row.channelId.indexOf(f.channelId) < 0) return false
      if ((f.online === 0 || f.online === 1) && row.online !== f.online) return false
      if (f.unit && row.unit.indexOf(unitName(f.unit)) < 0) return false
      if (f.area && f.area.length && !areaHit(row, f.area)) return false
      if (f.tags && f.tags.length && !tagHit(row, f.tags)) return false
      if (f.missing && f.missing.length) {
        const map = { name: 'missingName', coord: 'missingCoord', unit: 'missingUnit', area: 'missingArea', type: 'missingType', vendor: 'missingVendor', install: 'missingInstall', warranty: 'missingWarranty', tag: 'missingTag', addr: 'missingAddr' }
        const hit = f.missing.some(k => row[map[k]] === true)
        if (!hit) return false
      }
      return true
    }))
    const dcBindTab = ref("all")
    const dcTableView = computed(() => dcCondView.value.filter(function (row) {
      if (dcBindTab.value === "in") return !!row.bind
      if (dcBindTab.value === "out") return !row.bind
      return true
    }))
    const dcPage = ref(1)
    const dcPageSize = ref(10)
    const dcTableRef = ref(null)
    const dcPageView = computed(() => {
      const start = (dcPage.value - 1) * dcPageSize.value
      return dcTableView.value.slice(start, start + dcPageSize.value)
    })
    function dcPageChange(p) { dcPage.value = p }
    function dcSizeChange(s) { dcPageSize.value = s; dcPage.value = 1 }
    function dcClearPick() {
      dcChecked.value = []
      nextTick(function () { if (dcTableRef.value) dcTableRef.value.clearSelection() })
    }
    function dcBindTabChange() {
      dcPage.value = 1
      dcClearPick()
    }
    watch(function () { return dcTableView.value.length }, function () {
      const max = Math.max(1, Math.ceil(dcTableView.value.length / dcPageSize.value) || 1)
      if (dcPage.value > max) dcPage.value = max
    })
    function unitName(id) {
      if (id === "wx") return "文新派出所"
      if (id === "bsps") return "北山派出所"
      return ""
    }
    function dcTagName(id) {
      const node = findOrg(tagOrg, id)
      return node ? node.label : ""
    }
    function tagHit(row, ids) {
      return ids.some(id => {
        const name = dcTagName(id)
        return name && row.tags && row.tags.indexOf(name) >= 0
      })
    }
    function areaLastLabel(path) {
      let nodes = catRegionOptions
      let label = ""
      ;(path || []).forEach(value => {
        const hit = (nodes || []).find(item => item.value === value)
        if (!hit) return
        label = hit.label
        nodes = hit.children
      })
      return label
    }
    function areaHit(row, path) {
      const label = areaLastLabel(path)
      return !!(label && row.area && row.area.indexOf(label) >= 0)
    }
    function openDispatch(row) {
      dispatchTask.value = row
      dispatchOpen.value = true
    }
    const prefillTask = ref(null)
    function openTaskPrefill(row) {
      if (!row.n) {
        ElMessage.warning("请先配置设备")
        return
      }
      prefillTask.value = row
      Object.keys(taskPrefill).forEach(function (key) { taskPrefill[key] = "" })
      if (row.prefill) Object.assign(taskPrefill, row.prefill)
      prefillOpen.value = true
    }
    function saveTaskPrefill() {
      const row = prefillTask.value
      if (!row) return
      const data = {}
      prefillOf(String(row.items || "").split("、")).forEach(function (field) {
        const value = taskPrefill[field.key]
        if (value && !(Array.isArray(value) && !value.length)) data[field.key] = value
      })
      row.prefill = data
      row.prefillBy = row.creator || "罗港"
      row.prefillAt = nowStamp()
      prefillOpen.value = false
      ElMessage.success("已保存预填。派单后写入每台明细，设备仍是待治理")
    }
    function nowStamp() {
      const d = new Date()
      const p = function (n) { return String(n).padStart(2, "0") }
      return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes())
    }
    function prefillValueText(key, value) {
      if (value == null || value === "" || (Array.isArray(value) && !value.length)) return ""
      if (key === "unitId") return dcUnitName(value) || "已填"
      if (key === "tagIds") {
        const ids = Array.isArray(value) ? value : [value]
        const names = ids.map(function (id) { return dcTagName(id) }).filter(Boolean)
        return names.join("、") || "已填"
      }
      if (key === "areaId") return areaLastLabel(Array.isArray(value) ? value : [value]) || "已填"
      return String(value)
    }
    function prefillCoverLines(row) {
      if (!row || !row.prefill) return []
      return prefillOf(String(row.items || "").split("、")).map(function (field) {
        const text = prefillValueText(field.key, row.prefill[field.key])
        if (!text) return null
        return { label: field.label, text: text, n: row.n }
      }).filter(Boolean)
    }
    function dispatchDeleted(row) {
      if (!row || !row.boundIds) return []
      return dcDevices.filter(function (item) { return row.boundIds.indexOf(item.id) >= 0 && item.deleted })
    }
    function dispatchDeletedText(row) {
      const list = dispatchDeleted(row)
      if (!list.length) return ""
      return "有 " + list.length + " 台设备源表已删除（" + list.map(function (item) { return item.name }).join("、") + "），须先解绑后再派单。"
    }
    function prefillSummary(row) {
      if (!row || !row.prefill) return "未预填"
      const names = prefillOf(String(row.items || "").split("、")).filter(field => row.prefill[field.key]).map(field => field.label)
      return names.length ? names.join("、") : "未预填"
    }
    function dcSelect(node) {
      dcDir.value = node.id
      dcDirLabel.value = node.label
      dcChecked.value = []
    }
    function dcPickDir(node) {
      dcFilters.dir = node.id
      dcDirLabel.value = node.label
      dcDirExpand.value = false
    }
    function copyDcFilters(from, to) {
      to.name = (from.name || "").trim()
      to.deviceId = (from.deviceId || "").trim()
      to.channelId = (from.channelId || "").trim()
      to.online = from.online
      to.bind = from.bind
      to.unit = from.unit
      to.tags = (from.tags || []).slice()
      to.area = from.area || ""
      to.missing = (from.missing || []).slice()
      to.scope = from.scope || ""
      to.dir = from.dir || ""
    }
    function dcSearch() {
      dcFilters.name = (dcFilters.name || "").trim()
      dcFilters.deviceId = (dcFilters.deviceId || "").trim()
      dcFilters.channelId = (dcFilters.channelId || "").trim()
      copyDcFilters(dcFilters, dcApplied)
      dcPage.value = 1
      dcClearPick()
    }
    function applyNameScope(row) {
      const meta = row && taskHasName(row) ? catalogMeta(row.nameCatalog) : null
      if (!meta) return false
      dcFilters.scope = meta.scope
      dcFilters.dir = meta.scope === "base" ? "" : meta.value
      dcDirLabel.value = meta.label
      return true
    }
    function dcReset(refresh) {
      dcFilters.name = ""
      dcFilters.deviceId = ""
      dcFilters.channelId = ""
      dcFilters.online = ""
      dcFilters.bind = ""
      dcFilters.unit = ""
      dcFilters.tags = []
      dcFilters.area = ""
      dcFilters.missing = []
      if (!applyNameScope(dcTask.value)) {
        dcFilters.scope = ""
        dcFilters.dir = ""
      }
      if (refresh !== false) copyDcFilters(dcFilters, dcApplied)
      else copyDcFilters(dcFilters, dcApplied)
      dcPage.value = 1
      dcClearPick()
    }
    function applyTaskBinds(task) {
      const ids = (task && task.boundIds) || []
      dcDevices.forEach(function (row) { row.bind = ids.indexOf(row.id) >= 0 })
    }
    function rememberTaskBind(row, on) {
      const task = dcTask.value
      if (!task) return
      if (!task.boundIds) task.boundIds = []
      const index = task.boundIds.indexOf(row.id)
      if (on && index < 0) task.boundIds.push(row.id)
      if (!on && index >= 0) task.boundIds.splice(index, 1)
    }
    function openDeviceConfig(row) {
      dcTask.value = row
      if (!row.boundIds) row.boundIds = row.n ? dcDevices.filter(function (item) { return item.bind }).map(function (item) { return item.id }) : []
      applyTaskBinds(row)
      dcDir.value = "root"
      dcDirLabel.value = "原始目录"
      dcBindTab.value = "all"
      dcPage.value = 1
      dcReset(false)
      dcOpen.value = true
    }
    function dcMissingLabels(row) {
      const pairs = [["missingName", "名称"], ["missingCoord", "坐标"], ["missingUnit", "单位"], ["missingArea", "区划"], ["missingType", "类型"], ["missingVendor", "厂商"], ["missingInstall", "安装"], ["missingWarranty", "维保"], ["missingTag", "标签"], ["missingAddr", "地址"]]
      return pairs.filter(function (pair) { return row[pair[0]] }).map(function (pair) { return pair[1] })
    }
    function dcToggle(row, on) {
      if (on && row.deleted) {
        ElMessage.warning("源表已删除的设备不能加入")
        return
      }
      if (!!row.bind === !!on) return
      row.bind = !!on
      rememberTaskBind(row, !!on)
      if (dcTask.value) dcTask.value.n = Math.max(0, (dcTask.value.n || 0) + (on ? 1 : -1))
    }
    function dcScopeBrief() {
      const f = dcApplied
      const parts = []
      if (f.dir && dcDirLabel.value) parts.push(dcDirLabel.value)
      else if (f.scope === "base") parts.push("基础目录")
      else if (f.scope === "business") parts.push("业务目录")
      else if (f.scope === "original") parts.push("原始目录")
      const label = areaLastLabel(f.area)
      if (label) parts.push(label)
      if (f.missing && f.missing.length) {
        const names = { name: "规范名称", coord: "经纬度", unit: "管理单位", area: "行政区划", type: "设备类型", vendor: "厂商", install: "安装日期", warranty: "维保到期", tag: "业务标签", addr: "详细地址" }
        parts.push("缺" + f.missing.map(key => names[key] || key).join("/"))
      }
      return parts.join(" · ")
    }
    function dcBatch(bind) {
      const view = dcTableView.value
      const pickedIds = dcChecked.value.map(item => item.id)
      const targets = bind
        ? (pickedIds.length ? view.filter(row => pickedIds.indexOf(row.id) >= 0 && !row.deleted && !row.bind) : view.filter(row => !row.bind && !row.deleted))
        : view.filter(row => pickedIds.indexOf(row.id) >= 0 && row.bind)
      if (!targets.length) {
        ElMessage.warning(bind ? "没有可加入的设备" : "请先勾选要移出的设备")
        return
      }
      const skipped = bind && !pickedIds.length ? view.filter(row => row.deleted).length : 0
      const title = bind ? "确认加入任务？" : "确认移出任务？"
      const content = "将" + (bind ? "加入" : "移出") + " " + targets.length + " 台。" + (skipped ? "源表已删除的 " + skipped + " 台不加入。" : "")
      ElMessageBox.confirm(content, title, { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
        .then(() => {
          targets.forEach(row => { row.bind = bind; rememberTaskBind(row, bind) })
          if (dcTask.value) {
            dcTask.value.n = Math.max(0, (dcTask.value.n || 0) + (bind ? targets.length : -targets.length))
            const brief = dcScopeBrief()
            if (brief) {
              dcTask.value.scope = brief
              dcTask.value.scopeFull = brief + "；已锁定 " + dcTask.value.n + " 台。确认后名单不再随条件变化。"
            }
          }
          dcClearPick()
          ElMessage.success(bind ? "已加入 " + targets.length + " 台" : "已移出 " + targets.length + " 台")
        })
        .catch(() => {})
    }
    const memberTab = ref("govern")
    const memberPool = reactive([
      { userId: "1001", userName: "ligz", nickName: "李治理", dept: "西湖分局", govern: true, audit: false },
      { userId: "1002", userName: "wangsh", nickName: "王审核", dept: "市公安局", govern: false, audit: true },
      { userId: "1003", userName: "zhangw", nickName: "张伟", dept: "余杭分局", govern: true, audit: false },
      { userId: "1004", userName: "chenm", nickName: "陈敏", dept: "西湖分局", govern: false, audit: false },
      { userId: "1005", userName: "liuy", nickName: "刘洋", dept: "留下派出所", govern: false, audit: false }
    ])
    const memberKw = reactive({ userId: "", userName: "", nickName: "" })
    const memberApplied = reactive({ userId: "", userName: "", nickName: "" })
    const memberPick = ref([])
    const memberView = computed(() => memberPool.filter(row => memberTab.value === "govern" ? row.govern : row.audit))
    const memberGovernCount = computed(() => memberPool.filter(row => row.govern).length)
    const memberAuditCount = computed(() => memberPool.filter(row => row.audit).length)
    const memberUserView = computed(() => memberPool.filter(row => {
      if (memberApplied.userId && String(row.userId).indexOf(memberApplied.userId) < 0) return false
      if (memberApplied.userName && row.userName.indexOf(memberApplied.userName) < 0) return false
      if (memberApplied.nickName && row.nickName.indexOf(memberApplied.nickName) < 0) return false
      return true
    }).map(row => Object.assign({}, row, { inGroup: memberTab.value === "govern" ? row.govern : row.audit })))
    function openMemberAdd() {
      memberKw.userId = ""
      memberKw.userName = ""
      memberKw.nickName = ""
      memberApplied.userId = ""
      memberApplied.userName = ""
      memberApplied.nickName = ""
      memberPick.value = []
      memberOpen.value = true
    }
    function memberSearch() {
      memberApplied.userId = (memberKw.userId || "").trim()
      memberApplied.userName = (memberKw.userName || "").trim()
      memberApplied.nickName = (memberKw.nickName || "").trim()
      memberKw.userId = memberApplied.userId
      memberKw.userName = memberApplied.userName
      memberKw.nickName = memberApplied.nickName
      memberPick.value = []
    }
    function memberReset() {
      memberKw.userId = ""
      memberKw.userName = ""
      memberKw.nickName = ""
      memberSearch()
    }
    function memberAdd() {
      if (!memberPick.value.length) {
        ElMessage.warning("请选择要添加的用户")
        return
      }
      memberPick.value.forEach(row => {
        const hit = memberPool.find(item => item.userId === row.userId)
        if (!hit) return
        if (memberTab.value === "govern") hit.govern = true
        else hit.audit = true
      })
      memberOpen.value = false
      ElMessage.success("添加成功")
    }
    function memberRemove(row) {
      ElMessageBox.confirm("移除后不可恢复，是否移除该成员？", "确认移除？", { confirmButtonText: "确定", cancelButtonText: "取消", confirmButtonClass: "el-button--danger", closeOnClickModal: false })
        .then(() => {
          if (memberTab.value === "govern") row.govern = false
          else row.audit = false
          ElMessage.success("删除成功")
        })
        .catch(() => {})
    }
    function memberSelectable(row) { return !row.inGroup }
    const govStatusText = { "0": "待治理", "1": "已暂存", "2": "待审核", "3": "已退回", "4": "已完成" }
    const govStatusType = { "0": "warning", "1": "info", "2": "primary", "3": "danger", "4": "success" }
    const govDevices = reactive([
      { id: 1, name: "西湖小区东门监控", deviceId: "33010600001320000001", channelId: "33010600001320000011", filled: 4, total: 10, status: "0", rejected: 0, comments: "", locked: [], rejectedKeys: [], dir: "xx", missing: { standardName: false, unitId: false, areaId: false, addressDetail: false, deviceType: false, vendor: true, installDate: true, warrantyExpireDate: true, tagIds: false, lngLat: true }, values: { standardName: "西湖小区东门监控", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "文三路 100 号", deviceType: "枪机", vendor: "海康", installDate: "2024-03-12", warrantyExpireDate: "2027-03-11", tagIds: "学校周边", lng: "120.131200", lat: "30.280100" }, currents: { standardName: "西湖小区东门监控", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "120.130000,30.280000" }, suggestions: { vendor: { value: "海康", source: "同目录众数", sample: 12 }, installDate: { value: "2023-06-01", source: "同目录众数", sample: 8 }, warrantyExpireDate: { value: "2026-05-31", source: "同目录推算", sample: 6 }, lngLat: { value: "120.131500,30.280200", source: "坐标反查", sample: 1 } } },
      { id: 2, name: "文三路交叉口北向", deviceId: "33010600001320000002", channelId: "33010600001320000012", filled: 6, total: 10, status: "1", rejected: 0, comments: "", locked: [], rejectedKeys: [], dir: "xx", missing: { standardName: false, unitId: false, areaId: false, addressDetail: false, deviceType: false, vendor: false, installDate: true, warrantyExpireDate: true, tagIds: false, lngLat: false }, values: { standardName: "文三路交叉口北向", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "文三路与学院路交叉口", deviceType: "枪机", vendor: "大华", installDate: "2023-11-02", warrantyExpireDate: "2026-11-01", tagIds: "交叉口", lng: "120.128800", lat: "30.279400" }, currents: { standardName: "文三路交叉口北向", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "—" }, suggestions: { installDate: { value: "2023-08-15", source: "同目录众数", sample: 10 }, warrantyExpireDate: { value: "2026-08-14", source: "同目录推算", sample: 7 } } },
      { id: 3, name: "学校门口球机", deviceId: "33010600001320000021", channelId: "33010600001320000031", filled: 8, total: 10, status: "3", rejected: 2, comments: "经纬度与现场不符，业务标签未覆盖学校门口。", locked: ["unitId"], rejectedKeys: ["lngLat", "tagIds"], dir: "xx", missing: { standardName: false, unitId: false, areaId: false, addressDetail: false, deviceType: false, vendor: false, installDate: false, warrantyExpireDate: false, tagIds: true, lngLat: true }, values: { standardName: "学校门口球机", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "学军中学东门", deviceType: "球机", vendor: "海康", installDate: "2022-09-01", warrantyExpireDate: "2025-08-31", tagIds: "学校周边", lng: "120.140100", lat: "30.281200" }, currents: { standardName: "学校门口球机", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "学军中学东门", deviceType: "球机", vendor: "海康", installDate: "2022-09-01", warrantyExpireDate: "2025-08-31", tagIds: "—", lngLat: "120.139000,30.280000" }, suggestions: { tagIds: { value: "学校周边,校园周边", source: "同目录众数", sample: 5 }, lngLat: { value: "120.140200,30.281300", source: "坐标反查", sample: 1 } } },
      { id: 4, name: "浙一医院门诊", deviceId: "33010600001320000041", channelId: "33010600001320000051", filled: 10, total: 10, status: "2", rejected: 0, comments: "", locked: [], rejectedKeys: [], dir: "bs", missing: { standardName: false, unitId: false, areaId: false, addressDetail: false, deviceType: false, vendor: false, installDate: false, warrantyExpireDate: false, tagIds: false, lngLat: false }, values: { standardName: "浙一医院门诊", unitId: "北山派出所", areaId: "杭州市 / 西湖区 / 北山街道", addressDetail: "庆春路 79 号", deviceType: "枪机", vendor: "宇视", installDate: "2021-05-18", warrantyExpireDate: "2024-05-17", tagIds: "医院周边", lng: "120.181200", lat: "30.259800" }, currents: { standardName: "浙一医院门诊", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "—" } },
      { id: 5, name: "仓前街道球机", deviceId: "33011000001320000004", channelId: "33011000001320000014", filled: 10, total: 10, status: "4", rejected: 0, comments: "", locked: [], rejectedKeys: [], dir: "yh", missing: { standardName: false, unitId: false, areaId: false, addressDetail: false, deviceType: false, vendor: false, installDate: false, warrantyExpireDate: false, tagIds: false, lngLat: false }, values: { standardName: "仓前街道球机", unitId: "仓前派出所", areaId: "杭州市 / 余杭区 / 仓前街道", addressDetail: "仓前大街", deviceType: "球机", vendor: "海康", installDate: "2020-01-08", warrantyExpireDate: "2023-01-07", tagIds: "医院周边", lng: "120.001200", lat: "30.291000" }, currents: { standardName: "仓前街道球机", unitId: "仓前派出所", areaId: "杭州市 / 余杭区 / 仓前街道", addressDetail: "仓前大街", deviceType: "球机", vendor: "海康", installDate: "2020-01-08", warrantyExpireDate: "2023-01-07", tagIds: "医院周边", lngLat: "120.001200,30.291000" } }
    ])
    // —— 大数据量 mock：6 个原始目录，共补 55 台，合计 60 台 ——
    const govExtraDirs = [
      { dir: "xx", label: "西溪街道", unit: "文新派出所", area: "杭州市 / 西湖区 / 西溪街道", place: "文三路", n: 9 },
      { dir: "bs", label: "北山街道", unit: "北山派出所", area: "杭州市 / 西湖区 / 北山街道", place: "保俶路", n: 9 },
      { dir: "lx", label: "留下街道", unit: "留下派出所", area: "杭州市 / 西湖区 / 留下街道", place: "留下大街", n: 8 },
      { dir: "gd", label: "古荡街道", unit: "古荡派出所", area: "杭州市 / 西湖区 / 古荡街道", place: "古荡巷", n: 10 },
      { dir: "yh", label: "余杭区", unit: "仓前派出所", area: "杭州市 / 余杭区 / 仓前街道", place: "文一西路", n: 9 },
      { dir: "gs", label: "拱墅区", unit: "拱宸桥派出所", area: "杭州市 / 拱墅区 / 拱宸桥街道", place: "上塘路", n: 10 }
    ]
    const govKeys = ["standardName", "unitId", "areaId", "addressDetail", "deviceType", "vendor", "installDate", "warrantyExpireDate", "tagIds", "lngLat"]
    let govAutoId = 100
    govExtraDirs.forEach(function (seed, di) {
      for (let i = 0; i < seed.n; i++) {
        const code = String(di + 1).padStart(2, "0") + String(i + 1).padStart(3, "0")
        const mod = i % 10
        const status = mod === 3 ? "1" : (mod === 5 ? "3" : (mod === 7 ? "2" : (mod === 9 ? "4" : "0")))
        const filled = status === "4" || status === "2" ? 10 : (status === "1" ? 9 : (status === "3" ? 8 : 3 + (i % 5)))
        const missing = {}
        govKeys.forEach(function (k, ki) { missing[k] = ki >= filled })
        const values = {
          standardName: seed.label + "点位" + (i + 1),
          unitId: seed.unit,
          areaId: seed.area,
          addressDetail: seed.place + (i + 1) + "号",
          deviceType: ["枪机", "球机", "半球", "鹰眼"][i % 4],
          vendor: ["海康", "大华", "宇视", "华为"][i % 4],
          installDate: "202" + (1 + i % 4) + "-0" + (1 + i % 9) + "-1" + (i % 9),
          warrantyExpireDate: "202" + (4 + i % 4) + "-0" + (1 + i % 9) + "-1" + (i % 9),
          tagIds: ["重点区域", "公共安全", "交通枢纽"][i % 3],
          lng: (120.0 + di * 0.05 + i * 0.001).toFixed(6),
          lat: (30.2 + di * 0.02 + i * 0.001).toFixed(6)
        }
        const currents = {}
        govKeys.forEach(function (k) { currents[k] = "—" })
        currents.lngLat = "—"
        govDevices.push({
          id: govAutoId++,
          name: seed.label + "监控" + (i + 1),
          deviceId: "3301" + code + "000001",
          channelId: "3301" + code + "000011",
          filled: filled, total: 10, status: status,
          rejected: status === "3" ? 2 : 0,
          comments: status === "3" ? "坐标与现场不符，请复核。" : "",
          locked: [], rejectedKeys: status === "3" ? ["lngLat", "tagIds"] : [],
          dir: seed.dir, missing: missing, values: values, currents: currents,
          suggestions: status === "0" ? {
            unitId: { value: seed.unit, source: "同目录众数", sample: 6 + (i % 5) },
            areaId: { value: seed.area, source: "坐标反查", sample: 1 },
            deviceType: { value: values.deviceType, source: "同目录众数", sample: 5 + (i % 4) },
            vendor: { value: values.vendor, source: "同目录众数", sample: 4 + (i % 5) }
          } : {}
        })
      }
    })
    // 补齐基础目录 / 业务目录归属，用于目录体系切换
    govDevices.forEach(function (r) {
      if (!r.baseDir) {
        const parts = String(r.values.areaId || "").split(" / ")
        r.baseDir = parts.length >= 2 ? parts[parts.length - 2] + "_" + (r.values.unitId || "未绑定") : "未上架"
      }
      if (!r.bizDir) {
        const tag = String(r.values.tagIds || "").split(",")[0]
        r.bizDir = tag || "未上架"
      }
    })
    govDevices.forEach(function (r) {
      const existing = String((r.values && r.values.standardName) || "").trim()
      const keep = r.status !== "0" && existing && existing !== "—"
      r.catalogNames = { base: "", school: keep ? existing : "", road: "", hospital: "" }
      r.nameManual = { base: false, school: false, road: false, hospital: false }
      r.nameGenerated = { base: "", school: "", road: "", hospital: "" }
      if (r.id === 1) r.catalogNames.base = "西湖区_文新派出所_枪机"
      if (r.id === 4) r.catalogNames.hospital = "西湖区_医院_医院周边"
      if (r.id === 5) r.catalogNames.hospital = "余杭区_医院_医院周边"
      if (r.id === 100) {
        r.catalogNames.school = "西溪手改点位"
        r.nameManual.school = true
      }
      if (r.id === 3 && r.locked.indexOf("standardName") < 0) r.locked.push("standardName")
      if (r.values) r.values.standardName = r.catalogNames.school
      if (r.missing) r.missing.standardName = !r.catalogNames.school
    })
    const govScope = ref("original")
    function scopeLabel(key) {
      if (govScope.value === "original") return dirLabel(key)
      return key
    }
    const govQuery = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    const govApplied = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    const govChecked = ref([])
    const govGapFilter = ref("")
    const govViewMode = ref("device")
    const govGapBoard = computed(() => {
      const map = { standardName: "设备规范名称", unitId: "管理单位", areaId: "行政区划", addressDetail: "详细地址", deviceType: "设备类型", vendor: "设备厂商", installDate: "安装日期", warrantyExpireDate: "维保到期日", tagIds: "业务标签", lngLat: "经纬度" }
      const rows = govDevices.filter(r => r.status === "0" || r.status === "1" || r.status === "3")
      const arr = Object.keys(map).map(key => {
        const count = rows.filter(function (r) {
          if (key === "standardName" && taskHasName(activeGovTask.value)) return !catalogName(r, activeGovTask.value.nameCatalog)
          return r.missing && r.missing[key]
        }).length
        return { key, label: map[key], count }
      }).filter(item => item.count > 0 && activeItemKeys.value.indexOf(item.key) >= 0 && !(mode.value !== "three" && item.key === "standardName") && !(govScope.value === "original" && item.key === "standardName")).sort((a, b) => b.count - a.count)
      return arr
    })
    const govView = computed(() => govDevices.filter(row => {
      if (govApplied.name && row.name.indexOf(govApplied.name) < 0) return false
      if (govApplied.deviceId && row.deviceId.indexOf(govApplied.deviceId) < 0) return false
      if (govApplied.channelId && row.channelId.indexOf(govApplied.channelId) < 0) return false
      if (govApplied.status && row.status !== govApplied.status) return false
      if (govGapFilter.value && row.missing && !row.missing[govGapFilter.value]) return false
      return true
    }))
    const govPage = ref(1)
    const govPageSize = ref(10)
    const govPagedView = computed(() => {
      const start = (govPage.value - 1) * govPageSize.value
      return govView.value.slice(start, start + govPageSize.value)
    })
    function govPageChange(p) { govPage.value = p }
    function govSizeChange(s) { govPageSize.value = s; govPage.value = 1 }
    watch(govView, function () { govPage.value = 1 })
    watch(govViewMode, function () { govChecked.value = [] })
    watch(govScope, function () { govChecked.value = [] })
    const govClusters = computed(() => {
      const rows = govView.value
      const map = {}
      rows.forEach(row => {
        const key = govScope.value === "original"
          ? (row.dir || "未知")
          : (govScope.value === "base" ? (row.baseDir || "未上架") : (row.bizDir || "未上架"))
        if (!map[key]) map[key] = { dir: key, label: scopeLabel(key), devices: [], pending: 0, saved: 0, rejected: 0, gaps: {} }
        map[key].devices.push(row)
        if (row.status === "0") map[key].pending++
        if (row.status === "1") map[key].saved++
        if (row.status === "3") map[key].rejected++
        Object.keys(row.missing || {}).forEach(k => {
          if (k === "standardName" && (mode.value !== "three" || govScope.value === "original")) return
          if (row.missing[k]) map[key].gaps[k] = (map[key].gaps[k] || 0) + 1
        })
      })
      return Object.values(map).map(function (c) {
        c.gapList = Object.keys(c.gaps).map(function (k) {
          return { key: k, label: govFieldLabels[k] || k, count: c.gaps[k] }
        }).sort(function (a, b) { return b.count - a.count })
        return c
      }).sort((a, b) => b.devices.length - a.devices.length)
    })
    const govFieldLabels = {
      standardName: "规范名称", unitId: "管理单位", areaId: "行政区划", addressDetail: "详细地址",
      deviceType: "设备类型", vendor: "设备厂商", installDate: "安装日期", warrantyExpireDate: "维保到期",
      tagIds: "业务标签", lngLat: "经纬度"
    }
    function dirLabel(id) {
      if (id === "xx") return "西溪街道"
      if (id === "bs") return "北山街道"
      if (id === "lx") return "留下街道"
      if (id === "gd") return "古荡街道"
      if (id === "yh") return "余杭区"
      if (id === "gs") return "拱墅区"
      return id
    }
    const govStats = computed(() => {
      const all = govDevices
      const n = (s) => all.filter(row => row.status === s).length
      const done = n("4")
      return { total: all.length, pending: n("0"), saved: n("1"), reviewing: n("2"), rejected: n("3"), completed: done, rate: all.length ? Math.round(done * 1000 / all.length) / 10 : 0 }
    })
    function govSearch() {
      govChecked.value = []
      govApplied.name = (govQuery.name || "").trim()
      govApplied.deviceId = (govQuery.deviceId || "").trim()
      govApplied.channelId = (govQuery.channelId || "").trim()
      govApplied.status = govQuery.status
      govQuery.name = govApplied.name
      govQuery.deviceId = govApplied.deviceId
      govQuery.channelId = govApplied.channelId
      govChecked.value = []
    }
    function govReset() {
      govQuery.name = ""
      govQuery.deviceId = ""
      govQuery.channelId = ""
      govQuery.status = ""
      govGapFilter.value = ""
      govSearch()
    }
    function govSelectable(row) { return row.status === "0" || row.status === "1" || row.status === "3" }
    function deviceDisplayName(row) {
      if (!row) return ""
      if (mode.value !== "three" || govScope.value === "original") return row.name
      const std = row.values && row.values.standardName
      return std || "—"
    }
    function auditDisplayName(row) {
      if (!row) return ""
      const field = (row.fields || []).find(function (item) { return item.key === "standardName" })
      return field && field.next && field.next !== "—" ? field.next : "—"
    }
    function govProgress(row) {
      const keys = activeItemKeys.value
      let filled = 0
      keys.forEach(function (key) {
        if (key === "standardName" && taskHasName(activeGovTask.value)) {
          if (catalogName(row, activeGovTask.value.nameCatalog)) filled++
          return
        }
        if (row.missing && Object.prototype.hasOwnProperty.call(row.missing, key)) {
          if (!row.missing[key]) filled++
          return
        }
        if (key === "lngLat") {
          if (row.values && row.values.lng && row.values.lat) filled++
        } else if (row.values && row.values[key]) filled++
      })
      return { filled: filled, total: keys.length }
    }
    function govPercent(row) {
      const progress = govProgress(row)
      return progress.total ? Math.round(progress.filled * 100 / progress.total) : 0
    }
    const wbOpen = ref(false)
    const wbCurrent = ref(null)
    const wbScope = ref("")
    const wbScopeLabel = ref("")
    const wbDirty = ref(false)
    const wbNameManual = ref(false)
    const wbBase = ref("")
    const wbQuery = reactive({ name: "", channelId: "", status: "" })
    const wbApplied = reactive({ name: "", channelId: "", status: "" })
    const wbForm = reactive({})
    const wbFieldDefs = [
      { key: "standardName", label: "设备规范名称", kind: "text" },
      { key: "unitId", label: "管理单位", kind: "text" },
      { key: "areaId", label: "行政区划", kind: "text" },
      { key: "addressDetail", label: "详细地址", kind: "text" },
      { key: "deviceType", label: "设备类型", kind: "select" },
      { key: "vendor", label: "设备厂商", kind: "text" },
      { key: "installDate", label: "安装日期", kind: "date" },
      { key: "warrantyExpireDate", label: "维保到期日", kind: "date" },
      { key: "tagIds", label: "业务标签", kind: "text" },
      { key: "lngLat", label: "经纬度", kind: "lng", span: true }
    ]
    const wbFields = computed(() => wbFieldDefs.filter(field => activeItemKeys.value.indexOf(field.key) >= 0))
    const wbView = computed(() => govDevices.filter(row => {
      const allow = wbApplied.status ? [wbApplied.status] : ["0", "1", "3"]
      if (allow.indexOf(row.status) < 0) return false
      if (wbApplied.name && row.name.indexOf(wbApplied.name) < 0) return false
      if (wbApplied.channelId && row.channelId.indexOf(wbApplied.channelId) < 0) return false
      if (wbScope.value) {
        const key = govScope.value === "original" ? row.dir : (govScope.value === "base" ? row.baseDir : row.bizDir)
        if (key !== wbScope.value) return false
      }
      return true
    }))
    const wbPage = ref(1)
    const wbPageSize = ref(20)
    const wbPagedView = computed(() => {
      const start = (wbPage.value - 1) * wbPageSize.value
      return wbView.value.slice(start, start + wbPageSize.value)
    })
    function wbPageChange(p) { wbPage.value = p }
    watch(wbView, function () { wbPage.value = 1 })
    watch(wbCurrent, function (row) {
      if (!row) return
      const idx = wbView.value.findIndex(function (r) { return r.id === row.id })
      if (idx < 0) return
      const p = Math.floor(idx / wbPageSize.value) + 1
      if (p !== wbPage.value) wbPage.value = p
    })
    const wbTip = computed(() => {
      const s = wbCurrent.value && wbCurrent.value.status
      if (s === "0") return { type: "info", text: "待治理：表单回显共享库最新值；下方当前值同源，仅供对照。" }
      if (s === "1") return { type: "warning", text: "已暂存：表单为本人暂存数据；当前值仍来自共享库实时查询。" }
      if (s === "3") return { type: "error", text: "已退回：回显上次提交内容；已通过字段锁定；驳回项请改完后重交。" }
      return { type: "info", text: "" }
    })
    function wbFill(row) {
      Object.keys(wbForm).forEach(key => { delete wbForm[key] })
      Object.assign(wbForm, JSON.parse(JSON.stringify(row.values)))
      if (taskHasName(activeGovTask.value)) wbForm.standardName = catalogName(row, activeGovTask.value.nameCatalog)
      wbNameManual.value = !!(activeGovTask.value && row.nameManual && row.nameManual[activeGovTask.value.nameCatalog])
      wbCoordFrom.value = ""
      wbBase.value = JSON.stringify(wbForm)
      wbDirty.value = false
    }
    function wbChanged() { wbDirty.value = JSON.stringify(wbForm) !== wbBase.value }
    function wbSelect(row) {
      if (wbCurrent.value && wbCurrent.value.id === row.id) return
      const run = () => { wbPrev.value = wbCurrent.value; wbCurrent.value = row; wbFill(row) }
      if (wbCurrent.value && wbChanged()) {
        ElMessageBox.confirm("切换设备将舍弃当前修改，是否继续？", "有未保存修改", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(run).catch(() => {})
        return
      }
      run()
    }
    function openWb(row) {
      wbScope.value = ""
      wbScopeLabel.value = ""
      wbQuery.name = ""
      wbQuery.channelId = ""
      wbQuery.status = ""
      wbApplied.name = ""
      wbApplied.channelId = ""
      wbApplied.status = ""
      wbOpen.value = true
      wbPrev.value = null
      wbCurrent.value = row
      wbFill(row)
    }
    function openClusterGovern(c) {
      openWb(c.devices[0])
      wbScope.value = c.dir
      wbScopeLabel.value = c.label
    }
    function clearWbScope() {
      wbScope.value = ""
      wbScopeLabel.value = ""
    }
    function wbSearch() {
      wbApplied.name = (wbQuery.name || "").trim()
      wbApplied.channelId = (wbQuery.channelId || "").trim()
      wbApplied.status = wbQuery.status
      wbQuery.name = wbApplied.name
      wbQuery.channelId = wbApplied.channelId
    }
    function wbReset() {
      wbQuery.name = ""
      wbQuery.channelId = ""
      wbQuery.status = ""
      wbSearch()
    }
    function wbRowClass(arg) {
      const row = arg && arg.row ? arg.row : arg
      return wbCurrent.value && row && row.id === wbCurrent.value.id ? "wb-on" : ""
    }
    function wbMark() { wbDirty.value = true }
    function wbIncomplete() {
      const row = wbCurrent.value
      if (!row) return true
      return wbFields.value.some(field => {
        if (row.locked.indexOf(field.key) >= 0) return false
        if (field.kind === "lng") return !wbForm.lng || !wbForm.lat
        return !wbForm[field.key]
      })
    }
    function wbWrite() {
      const row = wbCurrent.value
      wbFields.value.forEach(field => {
        if (row.locked.indexOf(field.key) >= 0) return
        if (field.kind === "lng") {
          if (!wbForm.lng || !wbForm.lat) return
          row.values.lng = wbForm.lng
          row.values.lat = wbForm.lat
          if (row.missing) row.missing.lngLat = false
          return
        }
        if (field.key === "standardName") {
          const name = namePart(wbForm.standardName).slice(0, 50)
          if (!name) return
          setCatalogName(row, activeGovTask.value.nameCatalog, name, wbNameManual.value)
          return
        }
        if (!wbForm[field.key]) return
        row.values[field.key] = wbForm[field.key]
        if (row.missing) row.missing[field.key] = false
      })
      const progress = govProgress(row)
      row.filled = progress.filled
      row.total = progress.total
    }
    function wbAdvanceNext() {
      const list = wbView.value.slice()
      const idx = list.findIndex(row => row.id === wbCurrent.value.id)
      const prev = wbCurrent.value
      const next = idx >= 0 ? list[idx + 1] : null
      wbDirty.value = false
      wbPrev.value = prev
      if (next && (next.status === "0" || next.status === "1" || next.status === "3")) {
        wbCurrent.value = next
        wbFill(next)
      } else {
        wbCurrent.value = null
      }
    }
    function wbNameError() {
      const row = wbCurrent.value
      if (!row || !taskHasName(activeGovTask.value)) return ""
      if (row.locked.indexOf("standardName") >= 0) return ""
      const name = namePart(wbForm.standardName)
      if (!name) return ""
      if (name.length > 50) return "规范名称最多 50 字"
      const hit = nameClash(name, row, activeGovTask.value.nameCatalog)
      return hit ? ("与「" + hit.name + "」在同一生效目录内重名") : ""
    }
    function wbSave() {
      const row = wbCurrent.value
      if (!row) return
      const nameError = wbNameError()
      if (nameError) { ElMessage.warning(nameError); return }
      const incomplete = wbIncomplete()
      wbWrite()
      if (!incomplete) row.status = "1"
      else if (row.status === "1") row.status = "0"
      wbAdvanceNext()
    }
    function wbSubmit() {
      if (!wbCurrent.value) return
      const nameError = wbNameError()
      if (nameError) { ElMessage.warning(nameError); return }
      if (wbIncomplete()) {
        ElMessage.warning("请完整填写本任务的治理项后再提交")
        return
      }
      wbWrite()
      wbCurrent.value.status = "2"
      wbAdvanceNext()
    }
    function wbNext() {
      const list = wbView.value
      if (!list.length || !wbCurrent.value) {
        ElMessage.info("当前已是最后一条数据")
        return
      }
      const idx = list.findIndex(row => row.id === wbCurrent.value.id)
      const next = idx >= 0 ? list[idx + 1] : null
      if (!next) {
        ElMessage.info("当前已是最后一条数据")
        return
      }
      const run = () => { wbPrev.value = wbCurrent.value; wbCurrent.value = next; wbFill(next) }
      if (wbChanged()) {
        ElMessageBox.confirm("切换将舍弃当前修改，是否继续？", "有未保存修改", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(run).catch(() => {})
        return
      }
      run()
    }
    const wbPrev = ref(null)
    const wbCoordFrom = ref("")
    function wbHasCoord(row) {
      return !!(row && row.values && row.values.lng && row.values.lat)
    }
    const wbCanReuse = computed(() => wbHasCoord(wbPrev.value))
    function reuseWbPrev() {
      const prev = wbPrev.value
      if (!wbHasCoord(prev)) { ElMessage.warning("上一台还没有已保存的坐标"); return }
      wbForm.lng = prev.values.lng
      wbForm.lat = prev.values.lat
      wbCoordFrom.value = "reuse"
      wbMark()
    }
    const wbPin = computed(() => {
      if (wbForm.lng && wbForm.lat) return pinStyle(wbForm.lng, wbForm.lat)
      const cur = wbCurrent.value && parsePair(wbCurrent.value.currents && wbCurrent.value.currents.lngLat)
      if (cur) return pinStyle(cur.lng, cur.lat)
      return pinStyle("120.135000", "30.275000")
    })
    const wbCoordHint = computed(() => {
      if (wbCoordFrom.value === "reuse" && wbForm.lng && wbForm.lat) return "已沿用上一台的坐标，可再改。暂存或提交后才写入这台。"
      if (wbForm.lng && wbForm.lat) return "这是这台已填写的坐标，可再改。"
      const cur = wbCurrent.value && wbCurrent.value.currents && wbCurrent.value.currents.lngLat
      if (cur && cur !== "—") return "地图停在这台的原始坐标，尚未写入。"
      return "地图停在这台的区划中心，尚未写入。"
    })
    const govBatchOpen = ref(false)
    const govBatchTouched = ref(false)
    const govBatchStep = ref("form")
    const govBatchName = ref(true)
    const govNamePlan = ref(null)
    function openGovBatch() {
      govBatchTouched.value = false
      govBatchStep.value = "form"
      govBatchName.value = !!taskHasName(activeGovTask.value)
      govNamePlan.value = null
      govBatchOpen.value = true
    }
    function submitGovBatch() {
      const naming = govBatchName.value && taskNameRule.value
      if (!govBatchTouched.value && !naming) {
        ElMessage.warning("请至少填写一项后再批量提交")
        return
      }
      if (naming && govBatchStep.value !== "confirm") {
        govNamePlan.value = namePlan(govChecked.value)
        govBatchStep.value = "confirm"
        return
      }
      let named = 0
      if (naming && govNamePlan.value) {
        applyNamePlan(govNamePlan.value, true)
        named = govNamePlan.value.generate.length
      }
      govBatchOpen.value = false
      govBatchStep.value = "form"
      govChecked.value = []
      ElMessage.success(naming ? ("已生成 " + named + " 台规范名称。其他已填字段仍按原规则保留，未锁定项都齐的进入待审核。") : "批量治理已提交")
    }
    const govDetailOpen = ref(false)
    const govDetailRow = ref(null)
    function openGovDetail(row) {
      govDetailRow.value = row
      govDetailOpen.value = true
    }
    function currentOf(row, key) {
      if (!row) return "—"
      if (key === "lngLat") return row.currents.lngLat || "—"
      return row.currents[key] || "—"
    }
    function nameRuleOf(task) {
      if (!taskHasName(task)) return null
      const scope = task.nameCatalog || ""
      const meta = catalogMeta(scope)
      const label = meta ? meta.label : "生效目录"
      const rule = catalogRules.find(function (item) { return item.scope === scope && item.on })
      if (rule) return { source: "catalog", label: label, tpl: rule.tpl, preview: rule.preview, hint: "生效目录：" + label + "。模板：" + rule.tpl + "。示例：" + rule.preview + "。" }
      return { source: "global", label: label, tpl: "{序号}", preview: "001", hint: "生效目录：" + label + "。该目录没有启用模板，按全局默认 {序号} 生成。示例：001。" }
    }
    const taskNameRule = computed(function () { return nameRuleOf(activeGovTask.value) })
    function namePart(value) {
      const text = String(value || "").trim()
      if (!text || text === "—") return ""
      return text
    }
    function catalogName(row, scope) {
      if (!row || !scope || !row.catalogNames) return ""
      return namePart(row.catalogNames[scope])
    }
    function setCatalogName(row, scope, name, manual) {
      if (!row || !scope) return
      if (!row.catalogNames) row.catalogNames = { base: "", school: "", road: "", hospital: "" }
      if (!row.nameManual) row.nameManual = { base: false, school: false, road: false, hospital: false }
      if (!row.nameGenerated) row.nameGenerated = { base: "", school: "", road: "", hospital: "" }
      row.catalogNames[scope] = name
      row.nameManual[scope] = !!manual
      if (!manual) row.nameGenerated[scope] = name
      if (activeGovTask.value && activeGovTask.value.nameCatalog === scope && row.values) row.values.standardName = name
      if (row.missing) row.missing.standardName = !name
    }
    function nameClash(name, row, scope) {
      if (!name || !scope) return null
      return govDevices.find(function (item) { return item.id !== row.id && catalogName(item, scope) === name }) || null
    }
    function buildTaskName(row, usedExtra) {
      const rule = taskNameRule.value
      if (!rule || !row) return ""
      const area = namePart(row.values && row.values.areaId) || namePart(row.currents && row.currents.areaId)
      const parts = area.split("/").map(function (item) { return item.trim() }).filter(Boolean)
      const district = parts.length >= 2 ? parts[1] : (parts[0] || "")
      const city = parts[0] || ""
      const unit = namePart(row.values && row.values.unitId) || namePart(row.currents && row.currents.unitId)
      const type = namePart(row.values && row.values.deviceType) || namePart(row.currents && row.currents.deviceType)
      const tag = namePart(row.values && row.values.tagIds) || namePart(row.currents && row.currents.tagIds)
      const leaf = (tag.split(/[、,，;；]/)[0] || "").trim()
      const seq = String(row.id || 1).padStart(3, "0")
      const map = {
        "{管理单位}": unit,
        "{设备类型}": type,
        "{序号}": seq,
        "{行政区域:区县}": district,
        "{行政区域:地市}": city,
        "{行政区域:省}": "",
        "{标签:一级分类}": "",
        "{标签:二级分类}": leaf,
        "{标签:叶子结点}": leaf
      }
      let text = rule.tpl
      Object.keys(map).forEach(function (key) { text = text.split(key).join(map[key]) })
      text = text.replace(/_+/g, "_").replace(/^_|_$/g, "").replace(/\s+/g, " ").trim()
      if (!text) return ""
      text = text.slice(0, 50)
      const used = {}
      const scope = activeGovTask.value && activeGovTask.value.nameCatalog
      govDevices.forEach(function (item) {
        if (item.id === row.id) return
        const name = catalogName(item, scope)
        if (name) used[name] = true
      })
      Object.keys(usedExtra || {}).forEach(function (name) { used[name] = true })
      let next = text
      let n = 2
      while (used[next] && n < 100) {
        const suffix = "_" + n
        next = text.slice(0, 50 - suffix.length) + suffix
        n++
      }
      return next
    }
    function fillTaskName() {
      const row = wbCurrent.value
      if (!row || row.locked.indexOf("standardName") >= 0) return
      const name = buildTaskName(row)
      wbForm.standardName = name
      wbNameManual.value = false
      if (row.nameGenerated && activeGovTask.value) row.nameGenerated[activeGovTask.value.nameCatalog] = name
      wbMark()
      ElMessage.success("已按「" + taskNameRule.value.label + "」的命名规则填入，可再修改")
    }
    function wbNameInput() {
      wbMark()
      const row = wbCurrent.value
      const scope = activeGovTask.value && activeGovTask.value.nameCatalog
      const generated = row && scope && row.nameGenerated ? row.nameGenerated[scope] : ""
      wbNameManual.value = !generated || wbForm.standardName !== generated
    }
    function namePlan(rows) {
      const scope = activeGovTask.value && activeGovTask.value.nameCatalog
      const plan = { generate: [], skipHas: [], skipLock: [], skipManual: [] }
      const used = {}
      ;(rows || []).forEach(function (row) {
        if (!scope) return
        if (row.locked && row.locked.indexOf("standardName") >= 0) { plan.skipLock.push(row); return }
        if (row.nameManual && row.nameManual[scope]) { plan.skipManual.push(row); return }
        const existing = catalogName(row, scope)
        if (existing) { plan.skipHas.push(row); used[existing] = true; return }
        const name = buildTaskName(row, used)
        if (!name) return
        used[name] = true
        plan.generate.push({ row: row, name: name })
      })
      return plan
    }
    function applyNamePlan(plan, promote) {
      const scope = activeGovTask.value && activeGovTask.value.nameCatalog
      if (!plan || !scope) return
      plan.generate.forEach(function (item) {
        setCatalogName(item.row, scope, item.name, false)
        const progress = govProgress(item.row)
        item.row.filled = progress.filled
        item.row.total = progress.total
        if (promote && progress.filled >= progress.total && (item.row.status === "0" || item.row.status === "1" || item.row.status === "3")) item.row.status = "2"
      })
    }
    function writeAuditedName(audRow) {
      const task = activeGovTask.value
      if (!audRow || !taskHasName(task)) return false
      const field = (audRow.fields || []).find(function (item) { return item.key === "standardName" })
      if (!field || field.rejected || !field.locked) return false
      const name = namePart(field.next)
      if (!name) return false
      const dev = govDevices.find(function (item) { return item.channelId === audRow.channelId })
      if (!dev) return false
      setCatalogName(dev, task.nameCatalog, name, false)
      if (dev.locked.indexOf("standardName") < 0) dev.locked.push("standardName")
      return true
    }
    const oneStep = ref("form")
    const oneValue = ref("")
    const onePlan = ref(null)
    const oneItemOptions = computed(function () {
      return activeItemNames.value.map(function (name) { return { label: name, value: taskItemKeyMap[name] } }).filter(function (item) { return item.value })
    })
    const oneWriteOptions = computed(function () {
      return oneItemOptions.value.filter(function (item) { return item.value !== "lngLat" })
    })
    function oneTargets() {
      const picked = govChecked.value.length ? govChecked.value : govView.value
      return picked.filter(govSelectable)
    }
    function openOneField() {
      const options = oneWriteOptions.value
      if (!options.length) { ElMessage.warning("经纬度请到连续治理逐台填写"); return }
      oneField.value = options.some(function (item) { return item.value === "standardName" }) ? "standardName" : options[0].value
      oneValue.value = ""
      oneStep.value = "form"
      onePlan.value = null
      oneOpen.value = true
    }
    function submitOneField() {
      const targets = oneTargets()
      if (!targets.length) { ElMessage.warning("当前没有可填写的设备"); return }
      if (oneField.value === "standardName") {
        if (!taskNameRule.value) { ElMessage.warning("当前任务没有规范名称"); return }
        if (oneStep.value !== "confirm") {
          onePlan.value = namePlan(targets)
          oneStep.value = "confirm"
          return
        }
        const named = onePlan.value.generate.length
        applyNamePlan(onePlan.value, false)
        oneOpen.value = false
        ElMessage.success("已按规则写入 " + named + " 台。已有名称、已锁定和手改过的已跳过，设备状态未变。")
        return
      }
      const value = namePart(oneValue.value)
      if (!value) { ElMessage.warning("请填写要写入的值"); return }
      let written = 0
      let skipped = 0
      targets.forEach(function (row) {
        if (row.locked && row.locked.indexOf(oneField.value) >= 0) { skipped++; return }
        row.values[oneField.value] = value
        if (row.missing) row.missing[oneField.value] = false
        written++
      })
      oneOpen.value = false
      ElMessage.success("已写入 " + written + " 台，跳过已锁定 " + skipped + " 台。设备状态未变。")
    }
    const fillSheet = ref([])
    const exportKeys = ref([])
    const importRows = ref([])
    const importResult = ref(null)
    function toggleExportKey(key, on) {
      const list = exportKeys.value.slice()
      const index = list.indexOf(key)
      if (on && index < 0) list.push(key)
      if (!on && index >= 0) list.splice(index, 1)
      exportKeys.value = list
    }
    function sheetRows() {
      const picked = govChecked.value.length ? govChecked.value : govView.value
      return picked.filter(govSelectable)
    }
    function buildSheet() {
      const task = activeGovTask.value
      const scope = task && task.nameCatalog
      return sheetRows().map(function (row) {
        return {
          taskCode: task ? task.code : "",
          channelId: row.channelId,
          name: row.name,
          existingName: scope ? catalogName(row, scope) : "",
          standardName: scope ? catalogName(row, scope) : "",
          lockedName: !!(row.locked && row.locked.indexOf("standardName") >= 0)
        }
      })
    }
    function openExport() {
      exportKeys.value = activeItemKeys.value.slice()
      exportOpen.value = true
    }
    function downloadCsv(filename, lines) {
      const csv = lines.map(function (line) { return line.map(function (cell) { return '"' + String(cell == null ? "" : cell).replace(/"/g, '""') + '"' }).join(",") }).join("\n")
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    }
    function doExport() {
      const rows = buildSheet()
      if (!rows.length) { ElMessage.warning("当前没有可导出的设备"); return }
      if (rows.length > 10000) { ElMessage.warning("单次最多 1 万台"); return }
      fillSheet.value = rows
      const head = ["任务编号", "通道编码", "原始设备名称"]
      if (taskHasName(activeGovTask.value)) head.push("现有规范名称")
      if (exportKeys.value.indexOf("standardName") >= 0) head.push("设备规范名称")
      const body = rows.map(function (row) {
        const line = [row.taskCode, row.channelId, row.name]
        if (taskHasName(activeGovTask.value)) line.push(row.existingName)
        if (exportKeys.value.indexOf("standardName") >= 0) line.push(row.standardName)
        return line
      })
      downloadCsv((activeGovTask.value ? activeGovTask.value.code : "task") + "-填报.csv", [head].concat(body))
      exportOpen.value = false
      ElMessage.success("已导出 " + rows.length + " 台。原始名称和现有规范名称是核对列，导入时不覆盖。")
    }
    function openImport() {
      importResult.value = null
      if (!exportKeys.value.length) exportKeys.value = activeItemKeys.value.slice()
      const source = fillSheet.value.length ? fillSheet.value : buildSheet().slice(0, 8)
      importRows.value = source.map(function (row) { return Object.assign({}, row) })
      importOpen.value = true
    }
    function seedImportErrors() {
      if (!importRows.value.length) openImport()
      const rows = importRows.value.map(function (row) { return Object.assign({}, row) })
      const open = rows.filter(function (row) { return !row.lockedName })
      if (open[0]) open[0].standardName = "导入重名示例"
      if (open[1]) open[1].standardName = "导入重名示例"
      if (open[2]) open[2].standardName = "名".repeat(51)
      const locked = rows.find(function (row) { return row.lockedName })
      if (locked) locked.standardName = "锁定列忽略示例"
      rows.push({ taskCode: "ZL-NOT-THIS", channelId: "000", name: "错误任务", existingName: "", standardName: "不应写入", lockedName: false })
      importRows.value = rows
    }
    function runImport() {
      const task = activeGovTask.value
      if (!task) return
      const scope = task.nameCatalog
      const fails = []
      const ok = []
      const seenChannel = {}
      const seenName = {}
      let ignoredLock = 0
      const fillName = taskHasName(task) && exportKeys.value.indexOf("standardName") >= 0
      importRows.value.forEach(function (line, index) {
        const no = index + 2
        if (line.taskCode !== task.code) { fails.push({ no: no, channelId: line.channelId, name: line.name, reason: "任务编号与当前任务不一致" }); return }
        if (!line.channelId || seenChannel[line.channelId]) { fails.push({ no: no, channelId: line.channelId, name: line.name, reason: "通道编码为空或在文件内重复" }); return }
        seenChannel[line.channelId] = true
        const dev = govDevices.find(function (item) { return item.channelId === line.channelId })
        if (!dev || !govSelectable(dev)) { fails.push({ no: no, channelId: line.channelId, name: line.name, reason: "通道不在本任务仍可填写的设备中" }); return }
        const nextName = namePart(line.standardName)
        let skipName = false
        if (fillName && nextName && nextName !== catalogName(dev, scope)) {
          if (nextName.length > 50) { fails.push({ no: no, channelId: line.channelId, name: line.name, reason: "规范名称超过 50 字" }); return }
          if (line.lockedName || (dev.locked && dev.locked.indexOf("standardName") >= 0)) { skipName = true; ignoredLock++ }
          else if (seenName[nextName] || nameClash(nextName, dev, scope)) { fails.push({ no: no, channelId: line.channelId, name: line.name, reason: "规范名称在文件内或该生效目录内重复" }); return }
          else seenName[nextName] = true
        }
        ok.push({ dev: dev, line: line, skipName: skipName, nextName: nextName })
      })
      ok.forEach(function (item) {
        if (fillName && item.nextName && !item.skipName && item.nextName !== catalogName(item.dev, scope)) setCatalogName(item.dev, scope, item.nextName, true)
        const progress = govProgress(item.dev)
        item.dev.filled = progress.filled
        item.dev.total = progress.total
        if (progress.filled >= progress.total && (item.dev.status === "0" || item.dev.status === "1" || item.dev.status === "3")) item.dev.status = "2"
      })
      importResult.value = { ok: ok.length, fail: fails.length, ignored: ignoredLock, fails: fails }
      ElMessage.success("成功 " + ok.length + " 行，失败 " + fails.length + " 行" + (ignoredLock ? ("，已忽略锁定列 " + ignoredLock + " 处") : ""))
    }
    function applyTaskName() {
      const row = wbCurrent.value
      if (!row) return
      if (namePart(wbForm.standardName)) {
        ElMessageBox.confirm("输入框里已有规范名称，按规则生成会替换当前内容。", "按规则生成？", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(fillTaskName)
          .catch(function () {})
        return
      }
      fillTaskName()
    }
    function applySuggest(field) {
      const sug = wbCurrent.value && wbCurrent.value.suggestions && wbCurrent.value.suggestions[field.key]
      if (!sug) return
      if (field.kind === "lng") {
        const parts = String(sug.value).split(",")
        wbForm.lng = (parts[0] || "").trim()
        wbForm.lat = (parts[1] || "").trim()
      } else {
        wbForm[field.key] = sug.value
        if (field.key === "standardName") wbNameManual.value = true
      }
      wbMark()
    }
    const audFieldLabels = [
      ["standardName", "设备规范名称"], ["unitId", "管理单位"], ["areaId", "行政区划"], ["addressDetail", "详细地址"],
      ["deviceType", "设备类型"], ["vendor", "设备厂商"], ["installDate", "安装日期"], ["warrantyExpireDate", "维保到期日"],
      ["tagIds", "业务标签"], ["lngLat", "经纬度"]
    ]
    function audPack(nexts, currents, lockedKeys, rejectedKeys) {
      return audFieldLabels.map(function (pair) {
        return {
          key: pair[0], label: pair[1],
          next: nexts[pair[0]] || "—",
          current: currents[pair[0]] || "—",
          locked: lockedKeys.indexOf(pair[0]) >= 0,
          rejected: rejectedKeys.indexOf(pair[0]) >= 0
        }
      })
    }
    const audDevices = reactive([
      { id: 11, name: "浙一医院门诊", deviceId: "33010600001320000041", channelId: "33010600001320000051", passed: 0, total: 10, status: "2", resubmit: false, comments: "", rejected: 0, fields: audPack(
        { standardName: "浙一医院门诊", unitId: "北山派出所", areaId: "杭州市 / 西湖区 / 北山街道", addressDetail: "庆春路 79 号", deviceType: "枪机", vendor: "宇视", installDate: "2021-05-18", warrantyExpireDate: "2024-05-17", tagIds: "医院周边", lngLat: "120.181200,30.259800" },
        { standardName: "浙一医院门诊", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "—" },
        [], []) },
      { id: 12, name: "学校门口球机", deviceId: "33010600001320000021", channelId: "33010600001320000031", passed: 8, total: 10, status: "2", resubmit: true, comments: "", rejected: 0, fields: audPack(
        { standardName: "学校门口球机", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "学军中学东门", deviceType: "球机", vendor: "海康", installDate: "2022-09-01", warrantyExpireDate: "2025-08-31", tagIds: "学校周边", lngLat: "120.140100,30.281200" },
        { standardName: "学校门口球机", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "学军中学东门", deviceType: "球机", vendor: "海康", installDate: "2022-09-01", warrantyExpireDate: "2025-08-31", tagIds: "—", lngLat: "120.139000,30.280000" },
        ["standardName", "unitId", "areaId", "addressDetail", "deviceType", "vendor", "installDate", "warrantyExpireDate"], []) },
      { id: 13, name: "文三路交叉口北向", deviceId: "33010600001320000002", channelId: "33010600001320000012", passed: 6, total: 10, status: "3", resubmit: false, comments: "经纬度偏差过大，标签未覆盖交叉口。", rejected: 2, fields: audPack(
        { standardName: "文三路交叉口北向", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "文三路与学院路交叉口", deviceType: "枪机", vendor: "大华", installDate: "2023-11-02", warrantyExpireDate: "2026-11-01", tagIds: "交叉口", lngLat: "120.128800,30.279400" },
        { standardName: "文三路交叉口北向", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "—" },
        ["standardName", "unitId", "areaId", "addressDetail", "deviceType", "vendor", "installDate", "warrantyExpireDate"], ["tagIds", "lngLat"]) },
      { id: 14, name: "仓前街道球机", deviceId: "33011000001320000004", channelId: "33011000001320000014", passed: 10, total: 10, status: "4", resubmit: false, comments: "", rejected: 0, fields: audPack(
        { standardName: "仓前街道球机", unitId: "仓前派出所", areaId: "杭州市 / 余杭区 / 仓前街道", addressDetail: "仓前大街", deviceType: "球机", vendor: "海康", installDate: "2020-01-08", warrantyExpireDate: "2023-01-07", tagIds: "医院周边", lngLat: "120.001200,30.291000" },
        { standardName: "仓前街道球机", unitId: "仓前派出所", areaId: "杭州市 / 余杭区 / 仓前街道", addressDetail: "仓前大街", deviceType: "球机", vendor: "海康", installDate: "2020-01-08", warrantyExpireDate: "2023-01-07", tagIds: "医院周边", lngLat: "120.001200,30.291000" },
        ["standardName", "unitId", "areaId", "addressDetail", "deviceType", "vendor", "installDate", "warrantyExpireDate", "tagIds", "lngLat"], []) },
      { id: 15, name: "西湖小区东门监控", deviceId: "33010600001320000001", channelId: "33010600001320000011", passed: 0, total: 10, status: "2", resubmit: false, comments: "", rejected: 0, fields: audPack(
        { standardName: "学校门口球机", unitId: "文新派出所", areaId: "杭州市 / 西湖区 / 西溪街道", addressDetail: "文三路 100 号", deviceType: "枪机", vendor: "海康", installDate: "2024-03-12", warrantyExpireDate: "2027-03-11", tagIds: "学校周边", lngLat: "120.140100,30.281200" },
        { standardName: "西湖小区东门监控", unitId: "—", areaId: "杭州市 / 西湖区", addressDetail: "—", deviceType: "枪机", vendor: "—", installDate: "—", warrantyExpireDate: "—", tagIds: "—", lngLat: "—" },
        [], []) }
    ])
    audDevices.forEach(function (row) {
      if (row.id !== 11 && row.id !== 15) return
      row.fields.forEach(function (field) {
        if (field.key === "tagIds" && field.next && field.next !== "—") {
          field.prefillBy = "罗港"
          field.prefillAt = "2026-11-05 14:20"
        }
      })
    })
    const audQuery = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    const audApplied = reactive({ name: "", deviceId: "", channelId: "", status: "" })
    const audChecked = ref([])
    const audBaseView = computed(() => audDevices.filter(row => {
      if (audApplied.name && row.name.indexOf(audApplied.name) < 0) return false
      if (audApplied.deviceId && row.deviceId.indexOf(audApplied.deviceId) < 0) return false
      if (audApplied.channelId && row.channelId.indexOf(audApplied.channelId) < 0) return false
      if (audApplied.status && row.status !== audApplied.status) return false
      return true
    }))
    const audAnomalyFilter = ref("")
    const audView = computed(() => {
      const base = audBaseView.value
      if (!audAnomalyFilter.value) return base
      const key = audAnomalyFilter.value
      if (key.indexOf("area-mismatch:") === 0) {
        const deviceId = key.slice("area-mismatch:".length)
        return base.filter(function (row) { return row.deviceId === deviceId })
      }
      const sep = key.indexOf(":")
      if (sep < 0) return base
      const fieldKey = key.slice(0, sep) === "name-dup" ? "standardName" : "lngLat"
      const val = key.slice(sep + 1)
      return base.filter(function (row) {
        const f = row.fields.find(function (x) { return x.key === fieldKey })
        return f && f.next === val
      })
    })
    function toggleAnomaly(a) {
      audAnomalyFilter.value = audAnomalyFilter.value === a.id ? "" : a.id
      audChecked.value = []
    }
    function clearAnomaly() {
      audAnomalyFilter.value = ""
      audChecked.value = []
    }
    function audAnomalyOf(row) {
      return audAnomaly.value.filter(function (a) { return a.deviceIds.indexOf(row.deviceId) >= 0 }).length
    }
    function audAnomalyTip(row) {
      return audAnomaly.value.filter(function (a) { return a.deviceIds.indexOf(row.deviceId) >= 0 }).map(function (a) { return a.text }).join("；")
    }
    const audPage = ref(1)
    const audPageSize = ref(20)
    const audPagedView = computed(() => {
      const start = (audPage.value - 1) * audPageSize.value
      return audView.value.slice(start, start + audPageSize.value)
    })
    function audPageChange(p) { audPage.value = p }
    function audSizeChange(s) { audPageSize.value = s; audPage.value = 1 }
    watch(audView, function () { audPage.value = 1 })
    const audStats = computed(() => {
      const n = (s) => audDevices.filter(row => row.status === s).length
      const done = n("4")
      return { total: audDevices.length, pending: n("2"), rejected: n("3"), completed: done, rate: audDevices.length ? Math.round(done * 1000 / audDevices.length) / 10 : 0 }
    })
    function audSearch() {
      audApplied.name = (audQuery.name || "").trim()
      audApplied.deviceId = (audQuery.deviceId || "").trim()
      audApplied.channelId = (audQuery.channelId || "").trim()
      audApplied.status = audQuery.status
      audQuery.name = audApplied.name
      audQuery.deviceId = audApplied.deviceId
      audQuery.channelId = audApplied.channelId
      audAnomalyFilter.value = ""
      audChecked.value = []
    }
    function audReset() {
      audQuery.name = ""
      audQuery.deviceId = ""
      audQuery.channelId = ""
      audQuery.status = ""
      audSearch()
    }
    function audSelectable(row) { return row.status === "2" }
    function audPercent(row) {
      const fields = audTaskFields(row)
      if (!fields.length) return 0
      return Math.round(fields.filter(field => field.locked).length * 100 / fields.length)
    }
    function audPassedText(row) {
      const fields = audTaskFields(row)
      return fields.filter(field => field.locked).length + "/" + fields.length
    }
    function audIsDiff(field) {
      if (!field.next || field.next === "—") return false
      if (!field.current || field.current === "—") return true
      return String(field.next) !== String(field.current)
    }
    const audQuickReasons = ["与现场不符", "缺少依据材料", "坐标偏差过大", "标签未覆盖", "名称不规范"]
    function pickAudReason(r) {
      const cur = String(audRejectComment.value || "").trim()
      if (!cur) { audRejectComment.value = r; return }
      if (cur.indexOf(r) >= 0) return
      audRejectComment.value = cur + "；" + r
    }
    function pickAudComment(r) {
      const cur = String(audComment.value || "").trim()
      if (!cur) { audComment.value = r } else if (cur.indexOf(r) < 0) { audComment.value = cur + "；" + r }
      audMark()
    }
    function audBarColor(row) {
      const p = audPercent(row)
      if (p >= 100) return "#52c41a"
      if (row.status === "3") return "#fa8c16"
      if (p > 0) return "#1677ff"
      return "#e5e6eb"
    }
    function audBatchPass() {
      audGroupOpen.value = true
    }
    function confirmAudGroupPass() {
      audChecked.value.forEach(row => {
        const hit = audDevices.find(item => item.id === row.id)
        if (!hit) return
        hit.status = "4"
        hit.passed = hit.total
        hit.fields.forEach(field => { field.locked = true; field.rejected = false })
        writeAuditedName(hit)
      })
      audChecked.value = []
      audGroupOpen.value = false
      ElMessage.success(taskHasName(activeGovTask.value) ? ("批量通过成功。规范名称已回写到「" + catalogLabel(activeGovTask.value.nameCatalog) + "」，其他目录和原始名称未改。") : "批量通过成功")
    }
    const audRejectOpen = ref(false)
    const audRejectComment = ref("")
    const audGroupOpen = ref(false)
    const audGroups = computed(() => {
      const rows = audChecked.value.filter(r => r.status === "2")
      const groups = {}
      rows.forEach(row => {
        row.fields.forEach(field => {
          if (field.locked || !field.next || field.next === "—") return
          const k = field.key
          if (!groups[k]) groups[k] = {}
          const v = field.next
          if (!groups[k][v]) groups[k][v] = { value: v, label: field.label, devices: [], count: 0 }
          groups[k][v].devices.push(row.name)
          groups[k][v].count++
        })
      })
      return Object.entries(groups).map(([key, vals]) => ({
        key,
        groups: Object.values(vals).sort((a, b) => b.count - a.count)
      }))
    })
    function openAudReject() {
      audRejectComment.value = ""
      audRejectOpen.value = true
    }
    function confirmAudReject() {
      if (!String(audRejectComment.value || "").trim()) {
        ElMessage.warning("审核意见不能为空")
        return
      }
      audChecked.value.forEach(row => {
        const hit = audDevices.find(item => item.id === row.id)
        if (!hit) return
        hit.status = "3"
        hit.comments = audRejectComment.value.trim()
        hit.rejected = hit.total
        hit.fields.forEach(field => { if (!field.locked) field.rejected = true })
      })
      audChecked.value = []
      audRejectOpen.value = false
      ElMessage.success("批量驳回成功")
    }
    const audAnomaly = computed(() => {
      const list = audBaseView.value.filter(r => r.status === "2")
      const groups = []
      // 名称重复
      const nameMap = {}
      list.forEach(r => {
        const f = r.fields.find(x => x.key === "standardName")
        if (f && f.next && f.next !== "—") {
          if (!nameMap[f.next]) nameMap[f.next] = []
          nameMap[f.next].push({ name: r.name, deviceId: r.deviceId })
        }
      })
      Object.entries(nameMap).forEach(([name, arr]) => {
        if (arr.length > 1) groups.push({ id: "name-dup:" + name, type: "name-dup", text: "名称重复：" + name + "（" + arr.length + " 台）", devices: arr.map(x => x.name), deviceIds: arr.map(x => x.deviceId) })
      })
      // 坐标完全相同
      const coordMap = {}
      list.forEach(r => {
        const f = r.fields.find(x => x.key === "lngLat")
        if (f && f.next && f.next !== "—") {
          if (!coordMap[f.next]) coordMap[f.next] = []
          coordMap[f.next].push({ name: r.name, deviceId: r.deviceId })
        }
      })
      Object.entries(coordMap).forEach(([coord, arr]) => {
        if (arr.length > 1) groups.push({ id: "coord-dup:" + coord, type: "coord-dup", text: "坐标重复：" + coord + "（" + arr.length + " 台）", devices: arr.map(x => x.name), deviceIds: arr.map(x => x.deviceId) })
      })
      const itemText = activeGovTask.value && activeGovTask.value.items ? String(activeGovTask.value.items) : ""
      if (itemText.indexOf("行政区划") >= 0 && itemText.indexOf("经纬度") >= 0) {
        list.forEach(function (row) {
          const area = row.fields.find(function (field) { return field.key === "areaId" })
          const coord = row.fields.find(function (field) { return field.key === "lngLat" })
          if (!area || !coord || !area.next || area.next === "—" || !coord.next || coord.next === "—") return
          const filled = filledDistrict(area.next)
          const reversed = reverseDistrict(coord.next)
          if (!filled || !reversed || filled === reversed) return
          groups.push({
            id: "area-mismatch:" + row.deviceId,
            type: "area-mismatch",
            text: "区划与坐标不符：" + row.name + "（坐标在" + reversed + "，已填" + filled + "）",
            devices: [row.name],
            deviceIds: [row.deviceId]
          })
        })
      }
      return groups
    })
    function filledDistrict(text) {
      const parts = String(text || "").split("/").map(function (part) { return part.trim() }).filter(Boolean)
      for (let i = parts.length - 1; i >= 0; i--) {
        if (/[区县]$/.test(parts[i])) return parts[i]
      }
      return ""
    }
    function reverseDistrict(lngLat) {
      const bits = String(lngLat || "").split(",")
      const lng = parseFloat(bits[0])
      const lat = parseFloat(bits[1])
      if (!isFinite(lng) || !isFinite(lat)) return ""
      if (lng >= 120.16 && lat <= 30.27) return "上城区"
      if (lng < 120.08) return "余杭区"
      return "西湖区"
    }
    const audAreaHint = computed(function () {
      if (!audCurrent.value) return ""
      const hit = audAnomaly.value.find(function (item) {
        return item.type === "area-mismatch" && item.deviceIds.indexOf(audCurrent.value.deviceId) >= 0
      })
      return hit ? hit.text + "。请核对后再通过，不拦截提交。" : ""
    })
    const audOpen = ref(false)
    const audCurrent = ref(null)
    const audReview = reactive({})
    const audComment = ref("")
    const audDirty = ref(false)
    const audWbQuery = reactive({ name: "", deviceId: "", channelId: "" })
    const audWbApplied = reactive({ name: "", deviceId: "", channelId: "" })
    const audWbView = computed(() => audDevices.filter(row => {
      if (row.status !== "2") return false
      if (audWbApplied.name && row.name.indexOf(audWbApplied.name) < 0) return false
      if (audWbApplied.deviceId && row.deviceId.indexOf(audWbApplied.deviceId) < 0) return false
      if (audWbApplied.channelId && row.channelId.indexOf(audWbApplied.channelId) < 0) return false
      return true
    }))
    const audTip = computed(() => {
      if (!audCurrent.value || audCurrent.value.status !== "2") return { type: "warning", text: "" }
      if (audCurrent.value.resubmit) return { type: "info", text: "退回重交：灰色已通过字段免审；仅审核下方待审字段。" }
      return { type: "warning", text: "首轮待审：逐字段判定通过/驳回；存在驳回时审核意见必填。" }
    })
    function audTaskFields(row) {
      if (!row) return []
      return (row.fields || []).filter(field => activeItemKeys.value.indexOf(field.key) >= 0)
    }
    function audFill(row) {
      Object.keys(audReview).forEach(key => { delete audReview[key] })
      audTaskFields(row).forEach(field => { if (!field.locked) audReview[field.key] = 1 })
      audComment.value = row.comments || ""
      audDirty.value = false
    }
    function audSelect(row) {
      if (audCurrent.value && audCurrent.value.id === row.id) return
      const run = () => { audCurrent.value = row; audFill(row) }
      if (audDirty.value) {
        ElMessageBox.confirm("切换设备将舍弃当前修改，是否继续？", "有未保存修改", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(run).catch(() => {})
        return
      }
      run()
    }
    function openAud(row) {
      audWbQuery.name = ""
      audWbQuery.deviceId = ""
      audWbQuery.channelId = ""
      audWbApplied.name = ""
      audWbApplied.deviceId = ""
      audWbApplied.channelId = ""
      audOpen.value = true
      audCurrent.value = row
      audFill(row)
    }
    function audWbSearch() {
      audWbApplied.name = (audWbQuery.name || "").trim()
      audWbApplied.deviceId = (audWbQuery.deviceId || "").trim()
      audWbApplied.channelId = (audWbQuery.channelId || "").trim()
      audWbQuery.name = audWbApplied.name
      audWbQuery.deviceId = audWbApplied.deviceId
      audWbQuery.channelId = audWbApplied.channelId
    }
    function audWbReset() {
      audWbQuery.name = ""
      audWbQuery.deviceId = ""
      audWbQuery.channelId = ""
      audWbSearch()
    }
    function audRowClass(arg) {
      const row = arg && arg.row ? arg.row : arg
      return audCurrent.value && row && row.id === audCurrent.value.id ? "wb-on" : ""
    }
    function audMark() { audDirty.value = true }
    function audClose() {
      const run = () => { audOpen.value = false; audCurrent.value = null; audDirty.value = false }
      if (audDirty.value) {
        ElMessageBox.confirm("关闭将舍弃当前修改，是否继续？", "有未保存修改", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(run).catch(() => {})
        return
      }
      run()
    }
    function audSubmit() {
      const rejected = Object.keys(audReview).some(key => audReview[key] === 2)
      if (rejected && !String(audComment.value || "").trim()) {
        ElMessage.warning("请检查审核意见填写是否正确")
        return
      }
      const list = audWbView.value.slice()
      const idx = list.findIndex(row => row.id === audCurrent.value.id)
      const next = idx >= 0 ? list[idx + 1] : null
      audCurrent.value.comments = audComment.value
      const fields = audTaskFields(audCurrent.value)
      if (rejected) {
        audCurrent.value.status = "3"
        audCurrent.value.rejected = fields.filter(field => audReview[field.key] === 2).length
        fields.forEach(field => {
          if (audReview[field.key] === 2) field.rejected = true
          if (audReview[field.key] === 1) { field.locked = true; field.rejected = false }
        })
        writeAuditedName(audCurrent.value)
      } else {
        fields.forEach(field => { field.locked = true; field.rejected = false })
        audCurrent.value.passed = fields.length
        audCurrent.value.total = fields.length
        audCurrent.value.status = "4"
        writeAuditedName(audCurrent.value)
      }
      audDirty.value = false
      if (next && next.status === "2") {
        audCurrent.value = next
        audFill(next)
      } else {
        audCurrent.value = null
      }
    }
    function audNext() {
      const list = audWbView.value
      if (!list.length || !audCurrent.value) {
        ElMessage.info("当前已是最后一条数据")
        return
      }
      const idx = list.findIndex(row => row.id === audCurrent.value.id)
      const next = idx >= 0 ? list[idx + 1] : null
      if (!next) {
        ElMessage.info("当前已是最后一条数据")
        return
      }
      const run = () => { audCurrent.value = next; audFill(next) }
      if (audDirty.value) {
        ElMessageBox.confirm("切换将舍弃当前修改，是否继续？", "有未保存修改", { confirmButtonText: "确定", cancelButtonText: "取消", closeOnClickModal: false })
          .then(run).catch(() => {})
        return
      }
      run()
    }
    const audDetailOpen = ref(false)
    const audDetailRow = ref(null)
    function openAudDetail(row) {
      audDetailRow.value = row
      audDetailOpen.value = true
    }

    const showName = computed(() => mode.value === "three" && catalog.value !== "original")
    const dashSets = {
      original: { total: 12480, on: 10783, off: 1697, done: 4326, ing: 5102, todo: 3052, adds: [96, 88, 137, 100, 174, 150, 133] },
      base: { total: 8360, on: 7244, off: 1116, done: 3662, ing: 2890, todo: 1808, adds: [64, 58, 91, 66, 116, 100, 88] },
      school: { total: 1120, on: 968, off: 152, done: 468, ing: 390, todo: 262, adds: [8, 6, 12, 9, 15, 11, 10] },
      road: { total: 860, on: 742, off: 118, done: 280, ing: 340, todo: 240, adds: [6, 5, 9, 7, 11, 8, 7] },
      hospital: { total: 420, on: 362, off: 58, done: 168, ing: 152, todo: 100, adds: [3, 2, 5, 4, 6, 4, 3] }
    }
    const dashNow = computed(function () {
      const key = mode.value !== "three" || catalog.value === "original" ? "original" : catalog.value === "base" ? "base" : bizId.value
      return dashSets[key] || dashSets.school
    })
    const dashMore = ref(false)
    const dashCatMore = ref(false)
    const listOnline = ref(null)
    const listGov = ref(null)
    const dashDims = computed(() => {
      const total = dashNow.value.total
      const all = [
        { key: "name", name: "名称", rate: 72.0, color: "#1677ff" },
        { key: "coord", name: "经纬度", rate: 41.2, color: "#13c2c2" },
        { key: "area", name: "行政区划", rate: 63.5, color: "#52c41a" },
        { key: "type", name: "类型", rate: 80.1, color: "#722ed1" },
        { key: "unit", name: "单位", rate: 55.4, color: "#fa8c16" },
        { key: "tag", name: "标签", rate: 38.6, color: "#eb2f96" }
      ]
      return all.filter(d => d.key !== "name" || showName.value).map(function (d) {
        const ok = Math.round(total * d.rate / 100)
        return Object.assign({}, d, { ok: ok, miss: total - ok })
      })
    })
    function withFieldRates(rows) {
      const keys = ["name", "coord", "area", "type", "unit", "tag"]
      return rows.map((row, i) => {
        const rates = {}
        keys.forEach((k, ki) => {
          const n = (row.c * (17 + ((i * 13 + ki * 9) % 61)) + row.d * (ki + 3)) % 1000
          rates[k] = Math.round(Math.min(99.9, 12 + (n % 70) + ki * 2) * 10) / 10
        })
        return Object.assign({}, row, { rates })
      })
    }
    const dashRanks = withFieldRates([
      { n: "仓前派出所", c: 420, d: 60, r: 14.3 },
      { n: "北山派出所", c: 310, d: 70, r: 22.6 },
      { n: "留下派出所", c: 190, d: 48, r: 25.3 },
      { n: "西溪派出所", c: 280, d: 90, r: 32.1 },
      { n: "文新派出所", c: 260, d: 110, r: 42.3 },
      { n: "蒋村派出所", c: 240, d: 112, r: 46.7 },
      { n: "翠苑派出所", c: 210, d: 108, r: 51.4 },
      { n: "古荡派出所", c: 180, d: 102, r: 56.7 },
      { n: "转塘派出所", c: 160, d: 98, r: 61.3 },
      { n: "三墩派出所", c: 150, d: 104, r: 69.3 },
      { n: "西湖分局", c: 90, d: 72, r: 80.0 }
    ])
    const dashUnbound = withFieldRates([{ n: "未绑定单位", c: 860, d: 40, r: 4.7, fixed: true }])[0]
    const dashRankRows = computed(() => {
      const factor = dashNow.value.total / 12480
      const scale = function (row) {
        return Object.assign({}, row, { c: Math.max(1, Math.round(row.c * factor)), d: Math.max(0, Math.round(row.d * factor)) })
      }
      return (dashMore.value ? dashRanks : dashRanks.slice(0, 10)).map(scale).concat(scale(dashUnbound))
    })
    const dashAreaNodes = withFieldRates([
      { n: "临平区", c: 980, d: 86, r: 8.8 },
      { n: "钱塘区", c: 760, d: 92, r: 12.1 },
      { n: "余杭区", c: 2100, d: 294, r: 14.0 },
      { n: "萧山区", c: 1680, d: 286, r: 17.0 },
      { n: "富阳区", c: 920, d: 184, r: 20.0 },
      { n: "临安区", c: 640, d: 147, r: 23.0 },
      { n: "西湖区", c: 1860, d: 521, r: 28.0 },
      { n: "拱墅区", c: 1120, d: 381, r: 34.0 },
      { n: "滨江区", c: 890, d: 374, r: 42.0 },
      { n: "上城区", c: 980, d: 490, r: 50.0 },
      { n: "桐庐县", c: 550, d: 330, r: 60.0 }
    ])
    const dashBaseNodes = withFieldRates([
      { n: "临平区", c: 420, d: 29, r: 6.9 },
      { n: "钱塘区", c: 310, d: 34, r: 11.0 },
      { n: "余杭区", c: 860, d: 112, r: 13.0 },
      { n: "萧山区", c: 640, d: 102, r: 15.9 },
      { n: "富阳区", c: 380, d: 72, r: 18.9 },
      { n: "西湖区", c: 920, d: 239, r: 26.0 },
      { n: "拱墅区", c: 540, d: 173, r: 32.0 },
      { n: "滨江区", c: 410, d: 164, r: 40.0 },
      { n: "上城区", c: 460, d: 221, r: 48.0 },
      { n: "临安区", c: 260, d: 143, r: 55.0 }
    ])
    const dashBizById = {
      school: withFieldRates([
        { n: "幼儿园", c: 180, d: 22, r: 12.2 },
        { n: "小学", c: 460, d: 74, r: 16.1 },
        { n: "中学", c: 320, d: 70, r: 21.9 },
        { n: "高校", c: 96, d: 28, r: 29.2 },
        { n: "培训机构", c: 64, d: 24, r: 37.5 }
      ]),
      road: withFieldRates([
        { n: "交叉口", c: 420, d: 36, r: 8.6 },
        { n: "主路", c: 310, d: 48, r: 15.5 },
        { n: "匝道", c: 140, d: 26, r: 18.6 },
        { n: "桥梁", c: 86, d: 22, r: 25.6 },
        { n: "隧道", c: 48, d: 16, r: 33.3 }
      ]),
      hospital: withFieldRates([
        { n: "急诊", c: 64, d: 8, r: 12.5 },
        { n: "门诊", c: 120, d: 22, r: 18.3 },
        { n: "住院", c: 88, d: 24, r: 27.3 },
        { n: "医技", c: 36, d: 14, r: 38.9 },
        { n: "停车", c: 28, d: 14, r: 50.0 }
      ])
    }
    const dashFields = computed(() => {
      const all = [
        { key: "name", name: "名称" },
        { key: "coord", name: "经纬度" },
        { key: "area", name: "行政区划" },
        { key: "type", name: "类型" },
        { key: "unit", name: "单位" },
        { key: "tag", name: "标签" }
      ]
      return all.filter(d => d.key !== "name" || showName.value)
    })
    const dashCatAll = computed(() => catalog.value === "business" ? (dashBizById[bizId.value] || dashBizById.school) : catalog.value === "base" ? dashBaseNodes : dashAreaNodes)
    const dashCatRows = computed(() => dashCatMore.value ? dashCatAll.value : dashCatAll.value.slice(0, 10))
    const dashAdds = computed(function () { return dashNow.value.adds })
    const dashTrend = computed(function () {
      const set = dashNow.value
      const dates = ["10-23", "10-24", "10-25", "10-26", "10-27", "10-28", "10-29"]
      const rates = [28.4, 29.1, 30.2, 31.0, 32.4, 33.6, 34.7]
      const ys = [100, 99, 98, 97, 95, 94, 92]
      return dates.map(function (date, i) {
        return {
          x: 70 + i * 60,
          y: ys[i],
          add: set.adds[i],
          title: date + " 达标 " + Math.round(set.total * rates[i] / 100).toLocaleString() + " / " + set.total.toLocaleString() + "，完成率 " + rates[i].toFixed(1) + "%，当日新完成 " + set.adds[i]
        }
      })
    })
    const dashLine = computed(function () { return dashTrend.value.map(function (p) { return p.x + "," + p.y }).join(" ") })
    const dashArea = computed(function () {
      const pts = dashTrend.value
      if (!pts.length) return ""
      return pts[0].x + ",134 " + pts.map(function (p) { return p.x + "," + p.y }).join(" ") + " " + pts[pts.length - 1].x + ",134"
    })
    function openDash(kind) {
      listOnline.value = kind === "on" ? "1" : kind === "off" ? "0" : null
      listGov.value = kind === "done" ? "2" : kind === "ing" ? "1" : kind === "todo" ? "0" : null
      go("devices")
    }
    const unitSel = ref("xhf")
    const tagSel = ref("ga")
    const orgPane = ref("children")
    const orgKw = ref("")
    const orgStatus = ref("")
    const orgChecked = ref([])
    const orgMode = ref("edit")
    const orgSource = computed(() => page.value === "tag" ? tagOrg : unitOrg)
    const orgId = computed(() => page.value === "tag" ? tagSel.value : unitSel.value)
    const orgTree = computed(() => filterOrgTree(orgSource.value, orgKw.value.trim(), orgStatus.value))
    const orgNode = computed(() => findOrg(orgSource.value, orgId.value) || orgSource.value[0])
    const orgPath = computed(() => pathOrg(orgSource.value, orgNode.value.id) || [orgNode.value])
    const orgParentName = computed(() => orgPath.value.length > 1 ? orgPath.value[orgPath.value.length - 2].label : "无")
    const orgFormParent = computed(() => orgMode.value === "add" ? orgNode.value.label : orgParentName.value)
    const orgBound = computed(() => collectOrgDevices(orgNode.value))
    const orgDict = computed(() => page.value === "tag" ? dictOf(orgNode.value.id) : null)
    const orgBindLeaf = computed(() => {
      const n = orgNode.value
      if (page.value === "unit") return !!n.leaf
      if (n.dict) return false
      const dict = dictOf(n.id)
      return !!(dict && n.level >= dict.maxLevel)
    })
    const orgKindText = computed(() => {
      const n = orgNode.value
      if (page.value === "unit") return n.leaf ? "叶子" : "分类"
      if (n.dict) return "字典"
      return orgBindLeaf.value ? "叶子" : "分类"
    })
    const orgCanAdd = computed(() => {
      const n = orgNode.value
      if (page.value === "unit") return n.level < 3
      const dict = n.dict ? n : dictOf(n.id)
      return !!(dict && n.level < dict.maxLevel)
    })
    const orgAddHint = computed(() => {
      if (orgCanAdd.value) return ""
      if (page.value === "unit") return "已到第 3 级，不能再新增下级。"
      return "当前已达最大层级，不能新增下级。"
    })
    const orgForm = reactive({ name: "", code: "", maxLevel: 3 })
    const dictEditing = ref(false)
    const orgDialogTitle = computed(() => {
      if (orgMode.value === "dict") return dictEditing.value ? "编辑标签字典" : "新增标签字典"
      if (page.value === "unit") return orgMode.value === "add" ? "新增单位" : "编辑单位"
      return orgMode.value === "add" ? "新增下级" : "编辑标签"
    })
    function orgNodeLeaf(n) {
      if (!n) return false
      if (page.value === "unit") return !!n.leaf
      if (n.dict) return false
      const dict = dictOf(n.id)
      return !!(dict && n.level >= dict.maxLevel)
    }
    function pickOrg(n) {
      if (!n) return
      const full = findOrg(orgSource.value, n.id) || n
      if (page.value === "tag") tagSel.value = full.id
      else unitSel.value = full.id
      orgChecked.value = []
      orgPane.value = (page.value === "unit" ? full.leaf : (full.dict ? false : orgNodeLeaf(full))) ? "devices" : "children"
    }
    function orgAdd() {
      if (!orgCanAdd.value) { ElMessage.warning(orgAddHint.value); return }
      orgMode.value = "add"
      dictEditing.value = false
      orgForm.name = ""
      orgForm.code = ""
      orgForm.maxLevel = 3
      nodeOpen.value = true
    }
    function orgAddDict() {
      orgMode.value = "dict"
      dictEditing.value = false
      orgForm.name = ""
      orgForm.code = ""
      orgForm.maxLevel = 3
      nodeOpen.value = true
    }
    function orgEdit(n) {
      const node = n || orgNode.value
      if (n) pickOrg(n)
      orgForm.name = node.label
      orgForm.code = node.code || ""
      orgForm.maxLevel = node.maxLevel || 3
      if (page.value === "tag" && node.dict) {
        orgMode.value = "dict"
        dictEditing.value = true
      } else {
        orgMode.value = "edit"
        dictEditing.value = false
      }
      nodeOpen.value = true
    }
    function orgStop(n) {
      const node = n || orgNode.value
      if (!node.on) { ElMessage.success("已启用"); return }
      if (node.total > 0) {
        pickOrg(node)
        orgPane.value = "devices"
        ElMessage.warning("还有绑定，请先解绑")
        return
      }
      const msg = page.value === "unit"
        ? (node.leaf ? "停用后不能再被选为绑定目标。" : "停用后下级一并停用。")
        : "停用后不能再被选为绑定目标。下级标签状态不变。"
      ElMessageBox.confirm(msg, "停用").then(() => ElMessage.success("已停用")).catch(() => {})
    }
    function orgRemove(n) {
      const node = n || orgNode.value
      if (node.builtin) { ElMessage.warning(node.dict ? "预置字典不能删除" : "预置标签不能删除"); return }
      if (!node.leaf) { ElMessage.warning("请先处理下级"); return }
      if (node.total > 0) {
        pickOrg(node)
        orgPane.value = "devices"
        ElMessage.warning("还有绑定，请先解绑")
        return
      }
      ElMessageBox.confirm("删除后不可恢复。", "删除").then(() => ElMessage.success("已删除")).catch(() => {})
    }
    function unbindOrg(all) {
      const n = all ? orgBound.value.length : orgChecked.value.length
      if (!n) { ElMessage.warning("请先选择设备"); return }
      ElMessageBox.confirm("将解绑 " + n + " 台。解绑后按完成清单重算治理状态。", "解绑").then(() => ElMessage.success("已解绑 " + n + " 台，治理状态已重算")).catch(() => {})
    }
    const canSync = computed(() => mode.value === "original" || catalog.value === "original")
    const catalogKey = computed(() => (mode.value === "original" || catalog.value === "original") ? "original" : catalog.value)
    const currentBiz = computed(() => bizCatalogs.find(b => b.id === bizId.value) || bizCatalogs[0])
    const currentScopeTitle = computed(() => catalogKey.value === "business" ? currentBiz.value.name : catalogKey.value === "base" ? "基础目录" : "原始目录")
    const currentNameRule = computed(() => {
      const id = catalogKey.value === "business" ? bizId.value : catalogKey.value === "base" ? "base" : ""
      return catalogRules.find(r => r.scope === id && r.on) || null
    })
    const globalNameRule = { tpl: "{序号}", preview: "001" }
    const activeNameRule = computed(() => {
      if (currentNameRule.value) return { tpl: currentNameRule.value.tpl, preview: currentNameRule.value.preview, source: "catalog" }
      return { tpl: globalNameRule.tpl, preview: globalNameRule.preview, source: "global" }
    })
    const stat = computed(() => catalogKey.value === "business" ? currentBiz.value : catalogStat[catalogKey.value])
    const onlyLevel = ref(false)
    const rows = computed(() => devices.filter(d => {
      if (catalogKey.value === "base" && !d.shelf) return false
      if (catalogKey.value === "business" && !(d.bizIds || []).includes(bizId.value)) return false
      if (keyword.value && !d.name.includes(keyword.value)) return false
      if (nodeId.value) {
        if (onlyLevel.value) {
          if (d.node !== nodeId.value) return false
        } else if (!(nodeKids[nodeId.value] || []).includes(d.node)) return false
      }
      return true
    }))
    const listTotal = computed(() => {
      if (onlyLevel.value && nodeId.value) return rows.value.length
      const nums = catalogKey.value === "business" ? currentBiz.value.tree : treeCounts[catalogKey.value]
      return nodeId.value ? nums[nodeId.value] : nums.hz
    })
    const ruleDialogTitle = computed(() => ruleMode.value === "create" ? "新增命名模板" : "编辑命名模板")
    const ruleScopeOptions = computed(() => {
      const bound = new Set(catalogRules.map(r => r.scope))
      const all = [{ id: "base", name: "基础目录" }, ...bizCatalogs.map(b => ({ id: b.id, name: b.name }))]
      return all.map(o => ({ ...o, bound: bound.has(o.id) && !(ruleMode.value === "edit" && o.id === ruleForm.scope) }))
    })
    const rulePreview = computed(() => previewOf(ruleForm.tpl))
    const batchCount = computed(() => batchScope.value === "checked" ? lockedChecked.value.length : listTotal.value)
    const batchNames = computed(() => (batchScope.value === "checked" ? lockedChecked.value : rows.value).slice(0, 20))
    const coordList = reactive([
      { id: "a", node: "xx", shelf: true, bizIds: ["school"], q: "todo", name: "西湖小区东门监控", online: true, gov: "待治理", code: "33010600001320000088", type: "枪机", org: "文新派出所", platform: "市局平台", lnglat: "—", raw: "120.130100, 30.279200", areaCenter: "120.148000, 30.268000" },
      { id: "b", node: "xx", shelf: true, bizIds: [], q: "todo", name: "文三路交叉口北向", online: true, gov: "待治理", code: "33010600001320000021", type: "枪机", org: "文新派出所", platform: "市局平台", lnglat: "—", raw: "120.168000, 30.292000", areaCenter: "120.148000, 30.268000" },
      { id: "c", node: "bs", shelf: true, bizIds: [], q: "todo", name: "市府大楼球机", online: false, gov: "待治理", code: "33010600001320000015", type: "球机", org: "北山派出所", platform: "市局平台", lnglat: "—", raw: "", areaCenter: "120.155000, 30.258000" },
      { id: "d", node: "xx", shelf: true, bizIds: ["school", "hospital"], q: "done", name: "学校门口球机", online: true, gov: "已有坐标", code: "33010600001320000031", type: "球机", org: "文新派出所", platform: "市局平台", lnglat: "120.131200, 30.280100", raw: "120.129000, 30.279000", areaCenter: "120.148000, 30.268000" },
      { id: "e", node: "xx", shelf: true, bizIds: [], q: "na", name: "移动执法车", online: false, gov: "不适用", code: "33010600001320000040", type: "枪机", org: "文新派出所", platform: "市局平台", lnglat: "—", raw: "", areaCenter: "" },
      { id: "f", node: "yh", shelf: true, bizIds: ["road"], q: "todo", name: "仓前街道口", online: true, gov: "待治理", code: "33011000001320000018", type: "枪机", org: "仓前派出所", platform: "市局平台", lnglat: "—", raw: "119.990000, 30.305000", areaCenter: "120.005000, 30.295000" },
      { id: "g", node: "yh", shelf: false, bizIds: [], q: "todo", name: "余杭未上架枪机", online: true, gov: "待治理", code: "33011000001320000019", type: "枪机", org: "余杭分局", platform: "市局平台", lnglat: "—", raw: "", areaCenter: "120.005000, 30.295000" }
    ])
    const coordKw = ref("")
    const coordNodeId = ref("")
    const coordTree = computed(() => filterLabelTree(tree, coordKw.value.trim()))
    function coordInCatalog(d) {
      if (mode.value !== "three" || catalog.value === "original") return true
      if (catalog.value === "base") return !!d.shelf
      return (d.bizIds || []).indexOf(bizId.value) >= 0
    }
    function coordInNode(d) {
      if (!coordNodeId.value) return true
      return (nodeKids[coordNodeId.value] || [coordNodeId.value]).indexOf(d.node) >= 0
    }
    const coordMatched = computed(() => coordList.filter(d => coordInCatalog(d) && coordInNode(d)))
    function coordTodoNum(id) {
      const kids = nodeKids[id] || [id]
      return coordList.filter(d => d.q === "todo" && coordInCatalog(d) && kids.indexOf(d.node) >= 0).length
    }
    function pickCoordNode(data) { coordNodeId.value = data.id }
    const areaAdminTree = [
      { id: "zj", label: "浙江省", code: "33", deep: 0, children: [
        { id: "hzc", label: "杭州市", code: "3301", deep: 1, children: [
          { id: "xh", label: "西湖区", code: "330106", deep: 2, children: [
            { id: "xx", label: "西溪街道", code: "330106001", deep: 3 },
            { id: "bs", label: "北山街道", code: "330106008", deep: 3 },
            { id: "lx", label: "留下街道", code: "330106010", deep: 3 }
          ]},
          { id: "yh", label: "余杭区", code: "330110", deep: 2, children: [
            { id: "cq", label: "仓前街道", code: "330110005", deep: 3 }
          ]}
        ]}
      ]}
    ]
    const areaSel = ref("xh")
    const areaTab = ref("detail")
    function findArea(nodes, id) {
      for (const n of nodes) {
        if (n.id === id) return n
        if (n.children) {
          const hit = findArea(n.children, id)
          if (hit) return hit
        }
      }
    }
    const areaSelNode = computed(() => findArea(areaAdminTree, areaSel.value) || areaAdminTree[0])
    function pickArea(data) {
      areaSel.value = data.id
      if (data.deep === 2) areaTab.value = "detail"
    }
    const visibleQueue = computed(() => coordMatched.value.filter(d => d.q === queue.value))
    const currentCoord = computed(() => {
      const cur = coordList[coordIdx.value]
      if (cur && coordMatched.value.some(d => d.id === cur.id)) return cur
      return coordMatched.value[0] || { name: "当前目录没有设备", online: false, gov: "—", code: "—", type: "—", org: "—", platform: "—", lnglat: "—" }
    })
    const coordPrev = ref(null)
    const coordViewLng = ref("")
    const coordViewLat = ref("")
    const coordViewSource = ref("none")
    function parsePair(text) {
      if (!text || text === "—") return null
      const bits = String(text).split(/[,，]/)
      const lng = parseFloat(bits[0])
      const lat = parseFloat(bits[1])
      if (!isFinite(lng) || !isFinite(lat)) return null
      return { lng: lng.toFixed(6), lat: lat.toFixed(6) }
    }
    function pinStyle(lng, lat) {
      const x = ((parseFloat(lng) - 119.95) / 0.25) * 70 + 15
      const y = 78 - ((parseFloat(lat) - 30.25) / 0.08) * 58
      return { left: Math.min(88, Math.max(12, x)).toFixed(1) + "%", top: Math.min(82, Math.max(16, y)).toFixed(1) + "%" }
    }
    function coordSaved(d) { return parsePair(d && d.lnglat) }
    function showCoordDevice(d) {
      const saved = coordSaved(d)
      const raw = parsePair(d && d.raw)
      const area = parsePair(d && d.areaCenter)
      if (saved) {
        coordLng.value = saved.lng
        coordLat.value = saved.lat
        coordViewLng.value = saved.lng
        coordViewLat.value = saved.lat
        coordViewSource.value = "saved"
        return
      }
      coordLng.value = ""
      coordLat.value = ""
      if (raw) {
        coordViewLng.value = raw.lng
        coordViewLat.value = raw.lat
        coordViewSource.value = "raw"
      } else if (area) {
        coordViewLng.value = area.lng
        coordViewLat.value = area.lat
        coordViewSource.value = "area"
      } else {
        coordViewLng.value = ""
        coordViewLat.value = ""
        coordViewSource.value = "none"
      }
    }
    function rememberCoordPrev() {
      const cur = coordList[coordIdx.value]
      if (!cur) { coordPrev.value = null; return }
      const saved = coordSaved(cur)
      coordPrev.value = { id: cur.id, name: cur.name, lng: saved ? saved.lng : "", lat: saved ? saved.lat : "" }
    }
    const coordCanReuse = computed(() => !!(coordPrev.value && coordPrev.value.lng && coordPrev.value.lat))
    const coordPin = computed(() => {
      if (coordLng.value && coordLat.value) return pinStyle(coordLng.value, coordLat.value)
      if (coordViewLng.value && coordViewLat.value) return pinStyle(coordViewLng.value, coordViewLat.value)
      return { left: "50%", top: "46%" }
    })
    const coordViewHint = computed(() => {
      if (coordViewSource.value === "reuse" && coordLng.value && coordLat.value) return "已沿用上一台的坐标，可再拖开或手改。保存后才写入这台。"
      if (coordViewSource.value === "saved") return "这是这台已保存的治理坐标。"
      if (coordLng.value && coordLat.value) return "当前选点尚未保存。"
      if (coordViewSource.value === "raw") return "地图停在这台的原始坐标，尚未写入治理坐标。"
      if (coordViewSource.value === "area") return "地图停在这台的区划中心，尚未写入治理坐标。"
      return "这台没有可参照的坐标，请选点或手输。"
    })
    showCoordDevice(coordList[0])
    watch([catalog, bizId, coordNodeId], function () {
      const list = coordMatched.value
      const cur = coordList[coordIdx.value]
      if (cur && list.some(d => d.id === cur.id)) return
      coordPrev.value = null
      const next = list.find(d => d.q === queue.value) || list[0]
      coordIdx.value = next ? coordList.findIndex(d => d.id === next.id) : 0
      showCoordDevice(next || null)
    })
    const previewText = computed(() => {
      if (catMode.value === "unit" || (catMode.value === "mix" && trunk.value === "unit")) {
        return "市公安局\n  西湖分局\n    文新派出所\n      学校周边\n        西湖小区东门监控"
      }
      if (catMode.value === "tag") return "治安防控\n  校园周边\n    东门枪机\n    路口球机\n  医院周边\n    东门枪机\n交通\n  交叉口\n    路口球机"
      if (catMode.value === "mix") return "杭州市\n  西湖区\n    西溪街道\n      学校周边\n        西湖小区东门监控"
      return "杭州市\n  西湖区\n    西溪街道\n      西湖小区东门监控\n    北山街道\n  余杭区"
    })

    function go(id, group) {
      if (id === "catalogEdit") {
        catOpen.value = true
        id = "catalog"
      }
      page.value = id
      top.value = id === "apps" ? "" : (group || groupOf[id] || top.value)
      if (location.hash !== "#" + id) location.hash = id
    }
    function openCatalog(edit) {
      editing.value = edit
      if (!edit) catName.value = ""
      catOpen.value = true
    }
    const catTypeOptions = [
      { value: "area", label: "只按区域" },
      { value: "unit", label: "只按管理单位" },
      { value: "tag", label: "只按业务分类" },
      { value: "areaTag", label: "先区域后分类" },
      { value: "unitTag", label: "先管理单位后分类" }
    ]
    const catTagSources = [
      { id: "ga", name: "公安 GA" },
      { id: "cg", name: "城管 CG" },
      { id: "jt", name: "交通 JT" },
      { id: "sl", name: "水利 SL" },
      { id: "yj", name: "应急 YJ" },
      { id: "ms", name: "民生 MS" },
      { id: "zb", name: "装备 ZB" }
    ]
    const catUnitOptions = [
      { value: "sj", label: "市公安局", children: [
        { value: "xhfj", label: "西湖分局", children: [
          { value: "wx", label: "文新派出所" },
          { value: "bs", label: "北山派出所" }
        ]},
        { value: "yhfj", label: "余杭分局", children: [
          { value: "cq", label: "仓前派出所" }
        ]}
      ]}
    ]
    const catRegionOptions = [
      { value: "33", label: "浙江省", children: [
        { value: "3301", label: "杭州市", children: [
          { value: "330106", label: "西湖区" },
          { value: "330110", label: "余杭区" }
        ]},
        { value: "3302", label: "宁波市", children: [
          { value: "330203", label: "海曙区" }
        ]}
      ]}
    ]
    const catRegionProps = { checkStrictly: true, emitPath: true }
    const catRows = reactive([
      { id: 201, name: "西湖区学校点位", type: "area", tag: "", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-10-12 16:51:15", logs: [
        { time: "2026-11-02 22:00:00", off: 0, on: 0, after: 1260 },
        { time: "2026-11-01 22:00:00", off: 2, on: 5, after: 1260 },
        { time: "2026-10-31 22:00:00", off: 0, on: 0, after: 1257 }
      ]},
      { id: 200, name: "派出所责任目录", type: "unit", tag: "", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-10-11 09:12:00", logs: [
        { time: "2026-11-02 22:00:00", off: 186, on: 54, after: 8288 },
        { time: "2026-11-01 22:00:00", off: 8, on: 15, after: 8420 },
        { time: "2026-10-31 22:00:00", off: 0, on: 0, after: 8413 },
        { time: "2026-10-30 22:00:00", off: 40, on: 6, after: 8413 }
      ]},
      { id: 199, name: "全量标签域", type: "tag", tag: "", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-10-08 14:02:11", logs: [
        { time: "2026-11-02 22:00:00", off: 920, on: 2680, after: 20400 },
        { time: "2026-11-01 22:00:00", off: 30, on: 80, after: 18640 },
        { time: "2026-10-31 22:00:00", off: 0, on: 0, after: 18590 }
      ]},
      { id: 198, name: "公共安全标签", type: "tag", tag: "公安 GA", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-10-09 16:35:35", logs: [
        { time: "2026-11-02 22:00:00", off: 0, on: 3, after: 960 },
        { time: "2026-11-01 22:00:00", off: 0, on: 0, after: 957 }
      ]},
      { id: 197, name: "先区域后分类", type: "areaTag", tag: "公安 GA", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-10-09 17:18:48", logs: [
        { time: "2026-11-02 22:00:00", off: 410, on: 356, after: 5576 },
        { time: "2026-11-01 22:00:00", off: 12, on: 9, after: 5630 },
        { time: "2026-10-31 22:00:00", off: 0, on: 0, after: 5633 }
      ]},
      { id: 196, name: "先单位后分类", type: "unitTag", tag: "公安 GA", trunk: "", status: 1, updated: "2026-11-02 22:00:00", creator: "罗港", created: "2026-06-30 15:38:27", logs: [
        { time: "2026-11-02 22:00:00", off: 0, on: 0, after: 4100 },
        { time: "2026-11-01 22:00:00", off: 6, on: 1, after: 4100 }
      ]}
    ])
    const catKw = ref("")
    const catTypeQ = ref("")
    const catStatusQ = ref("")
    const catApplied = reactive({ name: "", type: "", status: "" })
    const catView = computed(() => catRows.filter(row => {
      if (catApplied.name && !row.name.includes(String(catApplied.name).trim())) return false
      if (catApplied.type && row.type !== catApplied.type) return false
      if (catApplied.status === 0 || catApplied.status === 1) {
        if (row.status !== catApplied.status) return false
      }
      return true
    }))
    function catTypeText(type) {
      const hit = catTypeOptions.find(item => item.value === type)
      return hit ? hit.label : "--"
    }
    function searchCat() {
      catApplied.name = catKw.value
      catApplied.type = catTypeQ.value
      catApplied.status = catStatusQ.value
    }
    function resetCat() {
      catKw.value = ""
      catTypeQ.value = ""
      catStatusQ.value = ""
      catApplied.name = ""
      catApplied.type = ""
      catApplied.status = ""
    }
    function toggleCat(row, on) {
      if (on) {
        row.status = 1
        ElMessage.success("启用成功")
        return
      }
      ElMessageBox.confirm("停用后该业务目录不可见不可用，已生成目录节点仍保留。是否确认停用？", "停用确认", { confirmButtonText: "确定", cancelButtonText: "取消" })
        .then(() => { row.status = 0; ElMessage.success("停用成功") })
        .catch(() => {})
    }
    function deleteCat(row) {
      ElMessageBox.confirm("删除后不可恢复。", "删除", { confirmButtonText: "确定", cancelButtonText: "取消" })
        .then(() => {
          const i = catRows.findIndex(item => item.id === row.id)
          if (i >= 0) catRows.splice(i, 1)
          ElMessage.success("删除成功")
        })
        .catch(() => {})
    }
    const catLogOpen = ref(false)
    const catLogRow = ref(null)
    function fmtCount(n) {
      return Number(n || 0).toLocaleString("zh-CN")
    }
    function openCatLog(row) {
      catLogRow.value = row
      catLogOpen.value = true
    }
    const catEditing = ref(false)
    const catPreviewed = ref(false)
    const catPreviewNodes = ref([])
    const catForm = reactive({
      id: null, name: "", generateType: "area", trunk: "area", regionSource: [], regionLevel: "", unitSource: [], unitLevel: "", tagSourceId: "", tagLevel: "", status: 1
    })
    const catRegionLevels = computed(() => {
      const all = [
        { value: "province", label: "省" },
        { value: "city", label: "市" },
        { value: "district", label: "区县" },
        { value: "street", label: "街道" }
      ]
      const start = catForm.regionSource && catForm.regionSource.length ? catForm.regionSource.length - 1 : 0
      return all.slice(start)
    })
    const catUnitLevels = computed(() => {
      const all = [
        { value: "L1", label: "一级" },
        { value: "L2", label: "二级" },
        { value: "L3", label: "三级" }
      ]
      const start = catForm.unitSource && catForm.unitSource.length ? catForm.unitSource.length - 1 : 0
      return all.slice(start)
    })
    function resetCatForm() {
      catForm.id = null
      catForm.name = ""
      catForm.generateType = "area"
      catForm.trunk = "area"
      catForm.regionSource = []
      catForm.regionLevel = ""
      catForm.unitSource = []
      catForm.unitLevel = ""
      catForm.tagSourceId = ""
      catForm.tagLevel = ""
      catForm.status = 1
      catPreviewed.value = false
      catPreviewNodes.value = []
    }
    function clearCatPreview() {
      catPreviewed.value = false
      catPreviewNodes.value = []
    }
    function onCatRegionChange() {
      const ok = catRegionLevels.value.some(item => item.value === catForm.regionLevel)
      if (catForm.regionLevel && !ok) catForm.regionLevel = ""
      clearCatPreview()
    }
    function onCatUnitChange() {
      const ok = catUnitLevels.value.some(item => item.value === catForm.unitLevel)
      if (catForm.unitLevel && !ok) catForm.unitLevel = ""
      clearCatPreview()
    }
    function pickCatType(type) {
      if (catEditing.value) return
      catForm.generateType = type
      catForm.trunk = "area"
      catForm.regionSource = []
      catForm.regionLevel = ""
      catForm.unitSource = []
      catForm.unitLevel = ""
      catForm.tagSourceId = ""
      catForm.tagLevel = ""
      clearCatPreview()
    }
    function regionLabel() {
      const path = catForm.regionSource || []
      let nodes = catRegionOptions
      let label = "杭州市"
      path.forEach(value => {
        const hit = (nodes || []).find(item => item.value === value)
        if (!hit) return
        label = hit.label
        nodes = hit.children
      })
      return label
    }
    function unitLabel() {
      const path = catForm.unitSource || []
      let nodes = catUnitOptions
      let label = "市公安局"
      path.forEach(value => {
        const hit = (nodes || []).find(item => item.value === value)
        if (!hit) return
        label = hit.label
        nodes = hit.children
      })
      return label
    }
    function tagLabel() {
      const hit = catTagSources.find(item => item.id === catForm.tagSourceId)
      return hit ? hit.name : ""
    }
    function leafPair() {
      return [
        { label: "学校周边", children: [{ label: "东门枪机" }] },
        { label: "医院周边", children: [{ label: "东门枪机" }] }
      ]
    }
    function sampleTree() {
      const area = regionLabel()
      const unit = unitLabel()
      const tag = tagLabel()
      const type = catForm.generateType
      if (type === "area") return [{ label: area, children: [{ label: "西湖区", children: [{ label: "西溪街道", children: [{ label: "西湖小区东门监控" }] }] }] }]
      if (type === "unit") return [{ label: unit, children: [{ label: "西湖分局", children: [{ label: "文新派出所", children: [{ label: "西湖小区东门监控" }] }] }] }]
      if (type === "tag") {
        const leaves = leafPair()
        if (tag === "重点区域") return [{ label: "重点区域", children: leaves }]
        if (tag === "公共安全") return [{ label: "公共安全", children: [{ label: "治安防控", children: [{ label: "校园周边", children: [{ label: "东门枪机" }] }] }] }]
        if (catForm.tagLevel === "L1") return [{ label: "重点区域", children: [{ label: "东门枪机" }] }, { label: "公共安全", children: [{ label: "东门枪机" }] }]
        return [
          { label: "重点区域", children: leaves },
          { label: "公共安全", children: [{ label: "治安防控", children: [{ label: "校园周边", children: [{ label: "东门枪机" }] }] }] }
        ]
      }
      const end = tag === "公共安全"
        ? [{ label: "校园周边", children: [{ label: "东门枪机" }] }, { label: "重点路段", children: [{ label: "东门枪机" }] }]
        : leafPair()
      if (type === "unitTag") return [{ label: unit, children: [{ label: "西湖分局", children: [{ label: "文新派出所", children: end }] }] }]
      return [{ label: area, children: [{ label: "西湖区", children: [{ label: "西溪街道", children: end }] }] }]
    }
    function needArea() {
      return catForm.generateType === "area" || catForm.generateType === "areaTag"
    }
    function needUnit() {
      return catForm.generateType === "unit" || catForm.generateType === "unitTag"
    }
    function validateCat() {
      if (!catForm.name.trim()) { ElMessage.warning("目录名称不能为空"); return false }
      if (catForm.name.trim().length > 50) { ElMessage.warning("目录名称长度不能超过50个字符"); return false }
      if (needArea() && !(catForm.regionSource && catForm.regionSource.length)) { ElMessage.warning("请选择区域源头"); return false }
      if (needArea() && !catForm.regionLevel) { ElMessage.warning("请选择区域展开到"); return false }
      if (needUnit() && !(catForm.unitSource && catForm.unitSource.length)) { ElMessage.warning("请选择管理单位源头"); return false }
      if (needUnit() && !catForm.unitLevel) { ElMessage.warning("请选择管理单位展开到"); return false }
      if ((catForm.generateType === "areaTag" || catForm.generateType === "unitTag") && !catForm.tagSourceId) { ElMessage.warning("请选择业务域 / 标签来源"); return false }
      return true
    }
    function refreshCatPreview() {
      if (!validateCat()) return
      catPreviewNodes.value = sampleTree()
      catPreviewed.value = true
    }
    function openCatAdd() {
      catEditing.value = false
      resetCatForm()
      catOpen.value = true
    }
    function openCatEdit(row) {
      catEditing.value = true
      catForm.id = row.id
      catForm.name = row.name
      catForm.generateType = row.type
      catForm.trunk = row.type === "unitTag" ? "unit" : "area"
      catForm.regionSource = row.type === "unit" || row.type === "unitTag" ? [] : ["33", "3301"]
      catForm.regionLevel = row.type === "unit" || row.type === "unitTag" ? "" : "district"
      catForm.unitSource = row.type === "unit" || row.type === "unitTag" ? ["sj", "xhfj"] : []
      catForm.unitLevel = row.type === "unit" || row.type === "unitTag" ? "L2" : ""
      const source = catTagSources.find(item => item.name === row.tag)
      catForm.tagSourceId = source ? source.id : ""
      catForm.tagLevel = ""
      catForm.status = row.status
      catPreviewNodes.value = sampleTree()
      catPreviewed.value = true
      catOpen.value = true
    }
    function submitCat() {
      if (!validateCat()) return
      if (!catEditing.value && !catPreviewed.value) return
      if (catEditing.value) {
        const row = catRows.find(item => item.id === catForm.id)
        if (row) row.name = catForm.name.trim()
        catOpen.value = false
        ElMessage.success("编辑业务目录成功")
        return
      }
      const now = "2026-11-03 10:20:00"
      catRows.unshift({
        id: Date.now() % 100000,
        name: catForm.name.trim(),
        type: catForm.generateType,
        trunk: "",
        tag: tagLabel(),
        status: 1,
        updated: now,
        creator: "罗港",
        created: now,
        logs: [{ time: now, off: 0, on: 128, after: 128 }]
      })
      catOpen.value = false
      ElMessage.success("新增业务目录成功")
    }
    function toggleTree(open) {
      treeOpen.value = open
      treeKey.value += 1
    }
    function pickMode(id) {
      if (!editing.value) catMode.value = id
    }
    function setMode(v) {
      mode.value = v
        if (v === "original") {
        catalog.value = "original"
        taskItems.value = taskItems.value.filter(item => item !== "设备规范名称")
        taskEditItems.value = taskEditItems.value.filter(item => item !== "设备规范名称")
        dcFilters.missing = (dcFilters.missing || []).filter(item => item !== "name")
        if (dcFilters.scope === "base" || dcFilters.scope === "business") {
          dcFilters.scope = ""
          dcFilters.dir = ""
        }
      }
    }
    function tagType(v) {
      if (v === "在线" || v === "已治理" || v === "已派发" || v === "启用") return "success"
      if (v === "治理中" || v === "待审核" || v === "有变化") return "warning"
      if (v === "离线" || v === "已退回") return "info"
      return "info"
    }
    function onTreeClick(data) { nodeId.value = data.id }
    function nodeCount(data) {
      const nums = catalogKey.value === "business" ? currentBiz.value.tree : treeCounts[catalogKey.value]
      return nums[data.id] || 0
    }
    function switchCatalog() { nodeId.value = "" }
    function openNaming() { nameOpen.value = true }
    function preferredScope() {
      const id = catalog.value === "business" ? bizId.value : catalog.value === "base" ? "base" : ""
      if (!id || catalogRules.some(r => r.scope === id)) return ""
      return id
    }
    function openRule(mode, row) {
      ruleMode.value = mode
      ruleIndex.value = row ? catalogRules.indexOf(row) : -1
      ruleForm.scope = row ? row.scope : preferredScope()
      ruleForm.tpl = row ? row.tpl : "{行政区域:区县}_{管理单位}_{设备类型}"
      ruleForm.on = row ? row.on : true
      ruleEditOpen.value = true
    }
    function insertToken(token) {
      const tpl = ruleForm.tpl || ""
      const last = tpl.slice(-1)
      const sep = tpl && !"_-./、 ".includes(last) ? "_" : ""
      ruleForm.tpl = tpl + sep + token
    }
    function saveRule() {
      if (!ruleForm.scope) { ElMessage.warning("请选择生效目录"); return }
      if (!ruleForm.tpl.trim()) { ElMessage.warning("请填写命名模板"); return }
      if (ruleMode.value === "create" && catalogRules.some(r => r.scope === ruleForm.scope)) {
        ElMessage.warning("该目录已绑定模板")
        return
      }
      const row = { scope: ruleForm.scope, scopeName: scopeName(ruleForm.scope), tpl: ruleForm.tpl.trim(), preview: previewOf(ruleForm.tpl.trim()), on: ruleForm.on }
      if (ruleMode.value === "create") catalogRules.push(row)
      else Object.assign(catalogRules[ruleIndex.value], row)
      ruleEditOpen.value = false
      ElMessage.success("已保存。之后在该目录新生成的名称按此模板执行，已经生成的名称不变")
    }
    function deleteRule(row) {
      ElMessageBox.confirm("确定删除「" + row.scopeName + "」的命名模板吗？删除后，该目录批量命名改用全局默认 {序号}。已生成的名称不变。", "删除命名模板", { type: "warning" })
        .then(() => {
          const i = catalogRules.indexOf(row)
          if (i >= 0) catalogRules.splice(i, 1)
          ElMessage.success("已删除")
        })
        .catch(() => {})
    }
    function previewDeviceName() {
      const rule = activeNameRule.value
      gName.value = rule.preview
      ElMessage.success(rule.source === "global" ? "已按全局默认预览，尚未保存" : "已按当前目录的模板预览，尚未保存")
    }
    function resetList() { keyword.value = ""; nodeId.value = ""; onlyLevel.value = false; listOnline.value = null; listGov.value = null }
    function onOnlyLevel(checked) {
      if (checked && !nodeId.value) {
        onlyLevel.value = false
        ElMessage.warning("请先选择左侧目录节点")
      }
    }
    function showFilter(key) { return filterKeys.value.includes(key) }
    function showCol(key) { return key === "name" || key === "action" || colKeys.value.includes(key) }
    function resetListConfig() {
      filterKeys.value = defaultFilters.slice()
      colKeys.value = defaultCols.slice()
    }
    function openBatch() {
      lockedChecked.value = checked.value.slice()
      lockedFilter.value = rows.value.slice()
      batchScope.value = lockedChecked.value.length ? "checked" : "filter"
      batchField.value = ""
      batchAction.value = "bind"
      batchValue.value = ""
      skipProtected.value = true
      batchStep.value = 1
      batchOpen.value = true
    }
    function previewBatch() {
      if (!batchField.value) { ElMessage.warning("请选择一个字段"); return }
      batchStep.value = 2
    }
    function runBatch() {
      const skipValue = batchField.value === "name" || (batchField.value === "unit" && batchAction.value === "unbind")
      const empty = Array.isArray(batchValue.value) ? !batchValue.value.length : !batchValue.value
      if (!skipValue && empty) {
        ElMessage.warning("请填写新值")
        return
      }
      batchOpen.value = false
      ElMessage.success("已写入 " + batchCount.value + " 台，治理状态已按清单重算")
    }
    function saveDetail() {
      ElMessage.success(geoWarn.value ? "已保存。坐标不在已选区内，仅作提示，治理状态已重算" : "已保存，治理状态已按清单重算")
    }
    function resetName() {
      gName.value = ""
      ElMessage.success("已清空治理名称，列表改显示原始名称")
    }
    function resetCoord() {
      lng.value = ""
      lat.value = ""
      ElMessage.success("已清空治理经纬度")
    }
    function resetType() {
      const origin = "枪机"
      const dict = ["枪机", "半球", "球机", "鹰眼", "全景", "梯半球", "针孔"]
      if (dict.includes(origin)) {
        gType.value = origin
        ElMessage.success("已按原始类型回填为「" + origin + "」")
      } else {
        gType.value = ""
        ElMessage.warning("原始类型对不上类型字典，已清空")
      }
    }
    function onMap(e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pin = e.currentTarget.querySelector(".pin")
      pin.style.left = (e.clientX - rect.left) + "px"
      pin.style.top = (e.clientY - rect.top) + "px"
      lng.value = (120.08 + Math.random() * 0.02).toFixed(6)
      lat.value = (30.30 + Math.random() * 0.01).toFixed(6)
      geoWarn.value = true
    }
    function fillArea() {
      areaPath.value = ["杭州市", "余杭区"]
      geoWarn.value = false
      ElMessage.success("已按坐标建议填入浙江省 / 杭州市 / 余杭区，尚未保存")
    }
    const thumbFiles = ref([])
    function onThumbChange(file, list) {
      thumbFiles.value = list.slice(-1)
    }
    function onThumbRemove() {
      thumbFiles.value = []
    }
    function onAreaChange() {
      const path = areaPath.value || []
      const node = path.length ? path[path.length - 1] : ""
      geoWarn.value = node === "余杭区" || node === "仓前街道"
    }
    const zoomLevels = reactive({ prov: "", city: "", county: "", town: "" })
    function applyLevelZoom() {
      const order = [["省", zoomLevels.prov], ["市", zoomLevels.city], ["区县", zoomLevels.county], ["乡镇/街道", zoomLevels.town]]
      const filled = order.filter(([, v]) => String(v).trim() !== "")
      for (const [name, v] of filled) {
        const n = Number(v)
        if (!Number.isInteger(n) || String(v).trim() !== String(n) || n < 1 || n > 20) {
          ElMessage.warning(name + "须为 1～20 的整数，本次不保存")
          return
        }
      }
      for (let i = 1; i < filled.length; i++) {
        if (Number(filled[i][1]) <= Number(filled[i - 1][1])) {
          ElMessage.warning(filled[i - 1][0] + "须小于" + filled[i][0] + "，本次不保存")
          return
        }
      }
      zoomOpen.value = false
      if (!filled.length) {
        ElMessage.info("各级均未填写，未作修改")
        return
      }
      const bits = filled.map(([name]) => {
        if (name === "市") return "市更新 1 个"
        if (name === "区县") return "区县更新 2 个，跳过 1 个（仓前街道无中心点）"
        if (name === "省") return "省更新 1 个"
        return "乡镇/街道更新 2 个，跳过 1 个（仓前街道无中心点）"
      })
      ElMessage.success("缩放已更新：" + bits.join("；") + "。中心经纬度未变更")
    }
    function queueCount(q) {
      return coordMatched.value.filter(d => d.q === q).length
    }
    function saveCoord() {
      if (!coordLng.value || !coordLat.value) { ElMessage.warning("请先选点或手输成对坐标"); return }
      const cur = coordList[coordIdx.value]
      if (!cur) return
      const todos = coordMatched.value.filter(d => d.q === "todo")
      const at = todos.findIndex(d => d.id === cur.id)
      const next = at >= 0 ? todos[at + 1] : null
      cur.lnglat = Number(coordLng.value).toFixed(6) + ", " + Number(coordLat.value).toFixed(6)
      cur.q = "done"
      cur.gov = "已有坐标"
      coordPrev.value = { id: cur.id, name: cur.name, lng: Number(coordLng.value).toFixed(6), lat: Number(coordLat.value).toFixed(6) }
      if (!next) {
        showCoordDevice(cur)
        ElMessage.success("坐标已保存，治理状态已重算")
        ElMessage.info("已是最后一台待治理，请切换目录")
        return
      }
      coordIdx.value = coordList.findIndex(d => d.id === next.id)
      showCoordDevice(coordList[coordIdx.value])
      ElMessage.success("坐标已保存，治理状态已重算")
    }
    function skipCoord() {
      const list = visibleQueue.value
      const at = list.findIndex(d => d.id === currentCoord.value.id)
      const next = at >= 0 ? list[at + 1] : null
      if (!next) { ElMessage.info("已是最后一台，请切换目录"); return }
      rememberCoordPrev()
      coordIdx.value = coordList.findIndex(d => d.id === next.id)
      showCoordDevice(next)
      ElMessage.info("已跳过，未保存")
    }
    function pickQueue(row) {
      if (!row || row.id === currentCoord.value.id) return
      rememberCoordPrev()
      const i = coordList.findIndex(d => d.id === row.id)
      if (i >= 0) coordIdx.value = i
      showCoordDevice(row)
    }
    function reusePrevCoord() {
      const prev = coordPrev.value
      if (!prev || !prev.lng || !prev.lat) { ElMessage.warning("上一台还没有已保存的坐标"); return }
      coordLng.value = prev.lng
      coordLat.value = prev.lat
      coordViewSource.value = "reuse"
    }
    function pickOnMap() {
      const baseLng = parseFloat(coordViewLng.value || coordLng.value || "120.130000")
      const baseLat = parseFloat(coordViewLat.value || coordLat.value || "30.280000")
      coordLng.value = (baseLng + 0.002).toFixed(6)
      coordLat.value = (baseLat + 0.001).toFixed(6)
      coordViewSource.value = "pick"
    }
    function onCoordType() {
      if (coordViewSource.value !== "reuse") coordViewSource.value = "pick"
    }
    function doGenerate() {
      if (!catName.value.trim()) { ElMessage.warning("请填写目录名称"); return }
      catOpen.value = false
      const byTag = catMode.value === "tag" || catMode.value === "mix"
      ElMessage.success(byTag ? "已生成。有几个叶子就挂几处，同一台可以出现多次，设备上的标签不改" : "已生成。缺这次用到的字段的设备不会挂上")
      go("catalog", "业务目录生成")
    }
    function confirmAssign() {
      if (!assigned.value) return
      assignOpen.value = false
      catOpen.value = false
      ElMessage.success("已按指定位置生成，设备上的标签没有改")
      go("catalog", "业务目录生成")
    }
    function confirmChange() {
      changeOpen.value = false
      catStatus.value = "已同步"
      ElMessage.success("已写入业务目录")
    }

    return {
      page, top, mode, catalog, catalogKey, bizId, bizCatalogs, currentBiz, currentScopeTitle, currentNameRule, stat, keyword, nodeId, onlyLevel, onOnlyLevel, rows, listTotal, tree, treeKey, treeOpen, toggleTree, onTreeClick, nodeCount, switchCatalog, resetList,
      batchOpen, batchStep, batchScope, batchField, batchAction, batchValue, skipProtected, batchCount, batchNames, lockedChecked, lockedFilter, previewBatch,
      filterKeys, colKeys, showFilter, showCol, resetListConfig, colOpen, nameOpen, checked,
      showName, dashMore, dashCatMore, dashDims, dashFields, dashRankRows, dashCatAll, dashCatRows, dashAdds, dashNow, dashTrend, dashLine, dashArea, openDash, listOnline, listGov, canSync, lng, lat, geoWarn, gName, gType, unitId, unitTree, tagIds, tagTree, areaPath, areaOptions, areaProps, thumbFiles, onThumbChange, onThumbRemove, tagType, go, setMode, openBatch, runBatch, resetName, resetCoord, resetType,
      openNaming, catalogRules, globalNameRule, activeNameRule, ruleScopeOptions, rulePreview, nameTokens, openRule, insertToken, saveRule, deleteRule, previewDeviceName,
      ruleEditOpen, ruleMode, ruleForm, ruleDialogTitle,
      saveDetail, onMap, fillArea, onAreaChange, coordIdx, coordLng, coordLat, coordKw, coordTree, coordNodeId, pickCoordNode, coordTodoNum, visibleQueue, currentCoord, queue, pickMode,
      areaAdminTree, areaSel, areaTab, areaSelNode, pickArea,
      saveCoord, skipCoord, pickQueue, reusePrevCoord, pickOnMap, onCoordType, coordPin, coordViewHint, coordCanReuse, naOpen, naReason, aiTab, aiOpen, aiMode, aiRow, aiTagNodes, aiTagChecked, aiTagExpanded, aiTagKw, aiTagFilterIds, aiTagTreeRef, aiTagFilter, filterAiTree, aiTable, aiCounts, aiRows, aiCanSelect, aiSelectedCount, aiScopeText, aiTodoCount, onAiTab, onAiSelect, aiPickPage, aiPickAll, startAi, runAiBatch, openAi, submitAi, aiStType, catMode, catName, trunk,
      previewText, editing, changeOpen, assignOpen, assigned, catStatus, doGenerate, confirmAssign,
      confirmChange, oneOpen, oneField, fillOpen, exportOpen, importOpen, imported, bindOpen,
      prefillOpen, zoomOpen, zoomLevels, applyLevelZoom, queueCount, unbindOpen, advancedOpen, syncOpen, syncLogOpen,
      nodeOpen, taskCreateOpen, taskEditOpen, dispatchOpen, dispatchTask, openDispatch, taskPrefill, prefillFields, taskItems, taskEditName, taskEditWho, taskEditItems, taskEditCatalog, taskCreateName, taskCreateWho, taskCreateCatalog, nameCatalogOptions, catalogLabel, taskHasName, openTaskCreate, openTaskEdit, saveTaskEdit, saveTaskCreate, prefillOf, taskRows, taskDetailTask, openTaskDetail, taskDetailDevices, taskDetailStats, taskDetailItems, taskDetailQuery, taskSearch, taskReset, taskPage, taskPageSize, taskPagedView, taskPageChange, taskSizeChange, taskStatusText, pickTaskStat, clearTaskStat, taskExport, taskDetailApplied, areaCreateOpen, catOpen, workTab, workRole, workGovStats,
      unitSel, tagSel, orgPane, orgKw, orgStatus, orgChecked, orgMode, orgForm, dictEditing, orgDialogTitle, orgDict, orgBindLeaf, orgKindText, orgNodeLeaf, orgTree, orgNode, orgPath, orgParentName, orgFormParent, orgBound, orgCanAdd, orgAddHint, pickOrg, orgAdd, orgAddDict, orgEdit, orgStop, orgRemove, unbindOrg,
      memberOpen, governItems, offerItems, activeGovTask, activeItemNames, openGovern, deviceDisplayName, auditDisplayName, govProgress, openTaskPrefill, saveTaskPrefill, prefillTask, prefillSummary, prefillCoverLines, dispatchDeleted, dispatchDeletedText, openCatalog, ElMessage, ElMessageBox, workRows,
      dcOpen, dcDirExpand, dcTask, dcDir, dcDirLabel, dcChecked, dcTree, dcUnitTree, dcTagTree, dcFilters, dcView, dcCondView, dcBindTab, dcTableView, dcPage, dcPageSize, dcPageView, dcTableRef, dcPageChange, dcSizeChange, dcBindTabChange, scopeDirTree, openDeviceConfig, dcSelect, dcPickDir, dcSearch, dcReset, dcMissingLabels, dcToggle, dcBatch,
      memberTab, memberView, memberKw, memberPick, memberUserView, memberGovernCount, memberAuditCount, openMemberAdd, memberSearch, memberReset, memberAdd, memberRemove, memberSelectable,
      govStatusText, govStatusType, govQuery, govView, govChecked, govStats, govSearch, govReset, govSelectable, govPercent, govGapBoard, govGapFilter, govViewMode, govClusters, dirLabel, govScope, scopeLabel, openClusterGovern, wbScope, wbScopeLabel, clearWbScope, govPage, govPageSize, govPagedView, govPageChange, govSizeChange,
      wbOpen, wbCurrent, wbQuery, wbView, wbPagedView, wbPage, wbPageSize, wbPageChange, wbForm, wbFieldDefs, wbFields, wbTip, wbSelect, openWb, wbSearch, wbReset, wbRowClass, wbMark, wbNameInput, wbSave, wbSubmit, wbNext, taskNameRule, nameRuleOf, catalogName, applyTaskName, reuseWbPrev, wbCanReuse, wbPin, wbCoordHint,
      govBatchOpen, govBatchTouched, govBatchStep, govBatchName, govNamePlan, openGovBatch, submitGovBatch, govDetailOpen, govDetailRow, openGovDetail, currentOf, applySuggest,
      oneStep, oneValue, onePlan, oneItemOptions, oneWriteOptions, openOneField, submitOneField, oneTargets,
      fillSheet, exportKeys, importRows, importResult, toggleExportKey, openExport, doExport, openImport, seedImportErrors, runImport,
      audQuery, audView, audPagedView, audPage, audPageSize, audPageChange, audSizeChange, audChecked, audStats, audSearch, audReset, audSelectable, audPercent, audPassedText, audTaskFields, audBarColor, audBatchPass, audRejectOpen, audRejectComment, openAudReject, confirmAudReject, audAnomaly, audAnomalyFilter, toggleAnomaly, clearAnomaly, audAnomalyOf, audAnomalyTip, audAreaHint, audGroupOpen, audGroups, confirmAudGroupPass, audIsDiff, audQuickReasons, pickAudReason, pickAudComment,
      audOpen, audCurrent, audReview, audComment, audWbQuery, audWbView, audTip, audSelect, openAud, audWbSearch, audWbReset, audRowClass, audMark, audClose, audSubmit, audNext, audDetailOpen, audDetailRow, openAudDetail,
      catTypeOptions, catTagSources, catRegionOptions, catUnitOptions, catRegionProps, catRows, catKw, catTypeQ, catStatusQ, catView, catTypeText, searchCat, resetCat, toggleCat, deleteCat,
      catLogOpen, catLogRow, fmtCount, openCatLog, catEditing, catPreviewed, catPreviewNodes, catForm, catRegionLevels, catUnitLevels, onCatRegionChange, onCatUnitChange, pickCatType, clearCatPreview, refreshCatPreview, openCatAdd, openCatEdit, submitCat
    }
  },
  template: `
<div class="app">
  <header class="topbar">
    <div class="brand"><i></i>视联网运营与应用</div>
    <nav class="top-nav">
      <button>首页</button>
      <button :class="{on: page==='apps'}" @click="go('apps')">应用中心</button>
      <button v-if="top" class="on">{{ top }}</button>
    </nav>
    <div class="top-user">
      <span class="avatar">罗</span>
      <span>罗港</span>
      <span>退出</span>
    </div>
  </header>
  <div class="frame">
    <aside class="sider" v-if="page!=='apps'">
      <div class="sider-scroll">
        <template v-if="top==='数据治理'">
          <div class="grp">视频数据治理</div>
          <div class="mi" :class="{on: page==='dash'}" @click="go('dash')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>治理仪表盘</div>
          <div class="grp">配置中心</div>
          <div class="mi" :class="{on: page==='unit'}" @click="go('unit')">管理单位</div>
          <div class="mi" :class="{on: page==='area'}" @click="go('area')">行政区划</div>
          <div class="mi" :class="{on: page==='tag'}" @click="go('tag')">业务标签</div>
          <div class="grp">数据治理</div>
          <div class="mi" :class="{on: page==='devices'||page==='detail'}" @click="go('devices')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>设备治理</div>
          <div class="mi" :class="{on: page==='coord'}" @click="go('coord')">经纬度治理</div>
          <div class="mi" :class="{on: page==='ai'}" @click="go('ai')">标签智能标注</div>
        </template>
        <template v-else-if="top==='治理任务'">
          <div class="grp">治理任务</div>
          <div class="mi" :class="{on: page==='tasks'}" @click="go('tasks')">任务管理</div>
          <div class="mi" :class="{on: page==='group'}" @click="go('group')">用户组配置</div>
          <div class="mi" :class="{on: page==='work'||page==='govern'||page==='audit'||page==='taskDetail'}" @click="go('work')">治理工作台</div>
        </template>
        <template v-else>
          <div class="grp">业务目录</div>
          <div class="mi" :class="{on: page==='catalog'||page==='catalogEdit'}" @click="go('catalog')">业务目录生成</div>
        </template>
      </div>
      <div class="sider-foot"><span>罗港</span><span>退出</span></div>
    </aside>
    <main class="main">
      <div class="proto" v-if="page!=='apps' && page!=='catalog' && page!=='catalogEdit'">
        <span>目录开通</span>
        <el-radio-group :model-value="mode" size="small" @change="setMode">
          <el-radio-button label="three">三种目录</el-radio-button>
          <el-radio-button label="original">只有原始</el-radio-button>
        </el-radio-group>
        <span class="hint">用来切换两种开通方式，正式页面没有这项。</span>
      </div>

      <section v-show="page==='apps'" class="hub">
        <div class="hub-hd">
          <h2>应用中心</h2>
          <p>选择要进入的应用。进入后，点击顶部「应用中心」返回本页。</p>
        </div>
        <div class="hub-grid">
          <div class="hub-card" @click="go('devices', '数据治理')">
            <div class="hub-mark blue">治</div>
            <div class="hub-body">
              <b>数据治理</b>
              <p>设备治理、治理仪表盘、经纬度治理、标签智能标注，以及管理单位、行政区划、业务标签。</p>
            </div>
            <span class="hub-go">进入</span>
          </div>
          <div class="hub-card" @click="go('tasks', '治理任务')">
            <div class="hub-mark green">任</div>
            <div class="hub-body">
              <b>治理任务</b>
              <p>任务管理、用户组配置、治理工作台。从工作台进入去治理、去审核。</p>
            </div>
            <span class="hub-go">进入</span>
          </div>
          <div class="hub-card" @click="go('catalog', '业务目录生成')">
            <div class="hub-mark orange">目</div>
            <div class="hub-body">
              <b>业务目录生成</b>
              <p>按区域、管理单位或业务分类生成目录。目录每天自动更新，可查看更新记录。</p>
            </div>
            <span class="hub-go">进入</span>
          </div>
        </div>
      </section>

      <section v-show="page==='dash'">
        <div class="dash-switch" v-if="mode==='three'">
          <el-radio-group v-model="catalog">
            <el-radio-button label="original">原始目录</el-radio-button>
            <el-radio-button label="base">基础目录</el-radio-button>
            <el-radio-button label="business">业务目录</el-radio-button>
          </el-radio-group>
          <el-select v-if="catalog==='business'" v-model="bizId">
            <el-option v-for="b in bizCatalogs" :key="b.id" :label="b.name" :value="b.id"/>
          </el-select>
        </div>
        <div class="dash-kpis">
          <div class="dash-kpi" @click="openDash('')">
            <div class="k">设备总数</div>
            <div class="n">{{ dashNow.total.toLocaleString() }}</div>
          </div>
          <div class="dash-kpi is-on" @click="openDash('on')">
            <div class="k">在线</div>
            <div class="n">{{ dashNow.on.toLocaleString() }}</div>
            <div class="s">在线率 {{ (dashNow.on * 100 / dashNow.total).toFixed(1) }}%</div>
          </div>
          <div class="dash-kpi is-off" @click="openDash('off')">
            <div class="k">离线</div>
            <div class="n">{{ dashNow.off.toLocaleString() }}</div>
          </div>
          <div class="dash-kpi is-done" @click="openDash('done')">
            <div class="k">已治理</div>
            <div class="n">{{ dashNow.done.toLocaleString() }}</div>
            <div class="s">完成率 {{ (dashNow.done * 100 / dashNow.total).toFixed(1) }}%</div>
          </div>
          <div class="dash-kpi is-ing" @click="openDash('ing')">
            <div class="k">治理中</div>
            <div class="n">{{ dashNow.ing.toLocaleString() }}</div>
          </div>
          <div class="dash-kpi is-todo" @click="openDash('todo')">
            <div class="k">未治理</div>
            <div class="n">{{ dashNow.todo.toLocaleString() }}</div>
          </div>
        </div>
        <div class="dash-mid">
          <div class="dash-panel">
            <div class="dash-hd">
              <h3>字段达标</h3>
              <span class="hint">{{ showName ? '名称、经纬度、行政区划、类型、单位、标签' : '原始目录不统计名称' }}</span>
            </div>
            <div class="vbars">
              <div class="vbar" v-for="d in dashDims" :key="d.key" :title="'达标 ' + d.ok.toLocaleString() + '，总数 ' + dashNow.total.toLocaleString() + '，达标率 ' + d.rate.toFixed(1) + '%，未达标 ' + d.miss.toLocaleString()">
                <div class="vbar-val">{{ d.rate.toFixed(1) }}%</div>
                <div class="vbar-track"><i :style="{ height: d.rate + '%', background: d.color }"></i></div>
                <div class="vbar-name">{{ d.name }}</div>
                <div class="vbar-miss">未达标 {{ d.miss.toLocaleString() }}</div>
              </div>
            </div>
          </div>
          <div class="dash-panel">
            <div class="dash-hd">
              <h3>近 7 天治理完成率</h3>
              <span class="legend"><i></i>完成率</span>
              <span class="legend"><i class="is-add"></i>当日新完成</span>
            </div>
            <svg class="trend" viewBox="0 0 460 200">
              <text x="4" y="18" font-size="11" fill="#9ca3af">100%</text>
              <text x="12" y="78" font-size="11" fill="#9ca3af">50%</text>
              <text x="20" y="138" font-size="11" fill="#9ca3af">0%</text>
              <line x1="52" y1="14" x2="444" y2="14" stroke="#f3f4f6"/>
              <line x1="52" y1="74" x2="444" y2="74" stroke="#f3f4f6"/>
              <line x1="52" y1="134" x2="444" y2="134" stroke="#e5e7eb"/>
              <polygon :points="dashArea" fill="rgba(22,119,255,0.12)"/>
              <polyline fill="none" stroke="#1677ff" stroke-width="2" :points="dashLine"/>
              <g fill="#1677ff">
                <circle v-for="p in dashTrend" :key="p.x" :cx="p.x" :cy="p.y" r="3.5"><title>{{ p.title }}</title></circle>
              </g>
              <g font-size="11" fill="#9ca3af" text-anchor="middle">
                <text x="70" y="156">10-23</text><text x="130" y="156">10-24</text><text x="190" y="156">10-25</text>
                <text x="250" y="156">10-26</text><text x="310" y="156">10-27</text><text x="370" y="156">10-28</text><text x="430" y="156">10-29</text>
              </g>
              <g font-size="11" fill="#fa8c16" text-anchor="middle">
                <text v-for="(n,i) in dashAdds" :key="i" :x="70 + i * 60" y="176">{{ n }}</text>
              </g>
            </svg>
          </div>
        </div>
        <div class="dash-ranks">
        <div class="dash-rank">
          <div class="dash-hd">
            <h3>单位治理排行</h3>
            <span class="spacer"></span>
            <el-button link type="primary" @click="dashMore=!dashMore">{{ dashMore ? '收起' : '查看全部' }}</el-button>
          </div>
          <div class="hint" style="margin-bottom:8px">按完成率从低到高。未绑定单位不参与排名，固定在末尾。右侧是各考核字段达标率。</div>
          <div class="rank-scroll">
          <el-table :data="dashRankRows" size="small" height="100%">
            <el-table-column label="排名" width="52" fixed><template #default="{ row, $index }"><span v-if="row.fixed" class="rank">—</span><span v-else class="rank" :class="{ top: $index < 3 }">{{ $index + 1 }}</span></template></el-table-column>
            <el-table-column prop="n" label="单位名称" min-width="108" fixed/>
            <el-table-column prop="c" label="设备数" width="72"/>
            <el-table-column prop="d" label="已完成" width="72"/>
            <el-table-column label="完成率" width="78"><template #default="{ row }">{{ row.r.toFixed(1) }}%</template></el-table-column>
            <el-table-column v-for="f in dashFields" :key="f.key" :label="f.name" width="78"><template #default="{ row }">{{ row.rates[f.key].toFixed(1) }}%</template></el-table-column>
          </el-table>
          </div>
        </div>
        <div class="dash-rank">
          <div class="dash-hd">
            <h3>目录治理排行</h3>
            <span class="spacer"></span>
            <el-button v-if="dashCatAll.length > 10" link type="primary" @click="dashCatMore=!dashCatMore">{{ dashCatMore ? '收起' : '查看全部' }}</el-button>
          </div>
          <div class="hint" style="margin-bottom:8px">{{ catalog==='business' ? '「' + currentBiz.name + '」的下一级，台数含下级。' : '当前目录根节点的下一级，台数含下级。' }}按完成率从低到高。右侧是各考核字段达标率。</div>
          <div class="rank-scroll">
          <el-table :data="dashCatRows" size="small" height="100%">
            <el-table-column label="排名" width="52" fixed><template #default="{ $index }"><span class="rank" :class="{ top: $index < 3 }">{{ $index + 1 }}</span></template></el-table-column>
            <el-table-column prop="n" label="节点名称" min-width="96" fixed/>
            <el-table-column prop="c" label="设备数" width="72"/>
            <el-table-column prop="d" label="已完成" width="72"/>
            <el-table-column label="完成率" width="78"><template #default="{ row }">{{ row.r.toFixed(1) }}%</template></el-table-column>
            <el-table-column v-for="f in dashFields" :key="'c'+f.key" :label="f.name" width="78"><template #default="{ row }">{{ row.rates[f.key].toFixed(1) }}%</template></el-table-column>
          </el-table>
          </div>
        </div>
        </div>
      </section>

      <section v-show="page==='devices'">
        <div class="page-head">
          <h2>设备治理</h2>
          <span class="spacer"></span>
          <el-tooltip v-if="mode==='three'" content="管理全部目录的命名模板，以及一条不能删的全局默认。和当前正在看的目录无关。" placement="bottom">
            <el-button @click="openNaming">命名规则</el-button>
          </el-tooltip>
        </div>
        <div class="split">
          <div class="tree-card">
            <div class="tree-hd"><span>设备目录</span></div>
            <el-radio-group v-if="mode==='three'" v-model="catalog" size="small" style="margin-bottom:8px" @change="switchCatalog">
              <el-radio-button label="original">原始</el-radio-button>
              <el-radio-button label="base">基础</el-radio-button>
              <el-radio-button label="business">业务</el-radio-button>
            </el-radio-group>
            <el-select v-if="mode==='three' && catalog==='business'" v-model="bizId" style="width:100%;margin-bottom:8px" @change="switchCatalog">
              <el-option v-for="b in bizCatalogs" :key="b.id" :label="b.name" :value="b.id"/>
            </el-select>
            <el-input placeholder="搜索目录" clearable style="margin-bottom:8px"/>
            <div class="tree-tools"><a @click="toggleTree(true)">全部展开</a><a @click="toggleTree(false)">全部折叠</a></div>
            <el-tree :key="treeKey" :data="tree" node-key="id" :current-node-key="nodeId" :default-expand-all="treeOpen" highlight-current :expand-on-click-node="false" @node-click="onTreeClick">
              <template #default="{ data }"><span class="tree-node"><i class="dot"></i>{{ data.label }}<em>{{ nodeCount(data) }}</em></span></template>
            </el-tree>
          </div>
          <div class="right-col">
            <div class="stats">
              <div class="stat"><div><div class="k">设备总数</div><div class="n">{{ stat.total }}<small>台</small></div></div><div class="ico blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div></div>
              <div class="stat"><div><div class="k">已治理</div><div class="n">{{ stat.done }}<small>台</small></div><div class="s">{{ stat.rate }} 治理完成率</div></div><div class="ico green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg></div></div>
              <div class="stat"><div><div class="k">治理中</div><div class="n">{{ stat.ing }}<small>台</small></div></div><div class="ico orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg></div></div>
              <div class="stat"><div><div class="k">待治理</div><div class="n">{{ stat.todo }}<small>台</small></div></div><div class="ico red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9 16H3z"/><path d="M12 9v5M12 16.5v.5"/></svg></div></div>
            </div>
            <div class="list-card">
              <div class="filters">
                <el-button v-if="canSync" type="primary" @click="syncOpen=true">数据同步</el-button>
                <el-button type="primary" @click="openBatch">批量修改</el-button>
                <el-button @click="colOpen=true">列表配置</el-button>
                <span class="grow"></span>
                <el-button v-if="canSync" @click="syncLogOpen=true">同步日志</el-button>
              </div>
              <div class="filters" style="margin-top:10px">
                <el-input v-if="showFilter('name')" v-model="keyword" placeholder="设备名称" clearable style="width:180px"/>
                <el-select v-if="showFilter('online')" v-model="listOnline" placeholder="在线状态" clearable style="width:110px"><el-option label="在线" value="1"/><el-option label="离线" value="0"/></el-select>
                <el-select v-if="showFilter('gov')" v-model="listGov" placeholder="治理状态" clearable style="width:110px"><el-option label="未治理" value="0"/><el-option label="治理中" value="1"/><el-option label="已治理" value="2"/></el-select>
                <el-select v-if="showFilter('coord')" placeholder="坐标状态" style="width:110px"><el-option label="有" value="1"/><el-option label="无" value="0"/></el-select>
                <el-select v-if="showFilter('type')" placeholder="设备类型" style="width:120px"><el-option v-for="t in ['枪机','半球','球机','鹰眼','全景','梯半球','针孔']" :key="t" :label="t" :value="t"/></el-select>
                <el-checkbox>显示已删除</el-checkbox>
                <el-checkbox v-model="onlyLevel" @change="onOnlyLevel">只展示本级</el-checkbox>
                <span class="grow"></span>
                <el-button type="primary" @click="ElMessage.success('查询完成')">查询</el-button>
                <el-button @click="resetList">重置</el-button>
                <el-button link type="primary" @click="advancedOpen=!advancedOpen">{{ advancedOpen ? '收起高级搜索' : '高级搜索' }}</el-button>
              </div>
              <div v-show="advancedOpen" class="filters" style="margin-top:10px">
                <el-select v-if="showFilter('vendor')" placeholder="设备厂商" style="width:140px"><el-option label="海康" value="海康"/><el-option label="大华" value="大华"/><el-option label="宇视" value="宇视"/></el-select>
                <el-select v-if="showFilter('unit')" placeholder="管理单位" style="width:140px"><el-option label="文新派出所" value="文新派出所"/><el-option label="北山派出所" value="北山派出所"/></el-select>
                <el-select v-if="showFilter('area')" placeholder="行政区划" style="width:140px"><el-option label="西湖区" value="西湖区"/><el-option label="西溪街道" value="西溪街道"/></el-select>
                <el-select v-if="showFilter('tag')" placeholder="业务标签" style="width:140px"><el-option label="学校周边" value="学校周边"/><el-option label="医院周边" value="医院周边"/></el-select>
                <el-date-picker v-if="showFilter('install')" type="daterange" start-placeholder="安装起" end-placeholder="安装止" style="width:240px"/>
                <el-date-picker v-if="showFilter('warranty')" type="daterange" start-placeholder="维保起" end-placeholder="维保止" style="width:240px"/>
              </div>
              <el-table :data="rows" style="margin-top:12px" @selection-change="checked=$event">
                <el-table-column type="selection" width="42"/>
                <el-table-column prop="name" label="设备名称" min-width="180" show-overflow-tooltip/>
                <el-table-column v-if="showCol('online')" label="在线状态" width="90"><template #default="{ row }"><el-tag :type="row.online==='在线'?'success':'info'" size="small">{{ row.online }}</el-tag></template></el-table-column>
                <el-table-column v-if="showCol('gov')" label="治理状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.gov)" size="small">{{ row.gov }}</el-tag></template></el-table-column>
                <el-table-column v-if="showCol('coord')" prop="coord" label="治理坐标" width="84"/>
                <el-table-column v-if="showCol('type')" prop="type" label="设备类型" width="90"/>
                <el-table-column v-if="showCol('vendor')" prop="vendor" label="设备厂商" width="90"/>
                <el-table-column v-if="showCol('unit')" prop="unit" label="管理单位" width="110" show-overflow-tooltip/>
                <el-table-column v-if="showCol('area')" label="行政区划" width="120">
                  <template #default="{ row }">
                    <el-tooltip v-if="row.areaPath" :content="row.areaPath" placement="top"><span>{{ row.area }}</span></el-tooltip>
                    <span v-else>—</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="showCol('tag')" prop="tags" label="标签" min-width="140" show-overflow-tooltip/>
                <el-table-column v-if="showCol('install')" prop="install" label="安装日期" width="120"/>
                <el-table-column v-if="showCol('warranty')" prop="warranty" label="维保到期" width="120"/>
                <el-table-column label="操作" width="80" fixed="right"><template #default><el-button link type="primary" @click="go('detail')">编辑</el-button></template></el-table-column>
              </el-table>
              <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="listTotal" :default-page-size="20" :page-sizes="[10,20,50,100]"/></div>
            </div>
          </div>
        </div>
      </section>

      <section v-show="page==='detail'">
        <div class="page-head">
          <el-button @click="go('devices')">返回</el-button>
          <h2>设备治理详情</h2>
          <span class="spacer"></span>
          <el-button type="primary" @click="saveDetail">保存修改</el-button>
        </div>
        <div class="detail-meta">
          <el-tag size="small" type="success">在线</el-tag>
          <el-tag size="small" type="warning">治理中</el-tag>
          <span class="hint">设备编码 34020000001320000088</span>
          <span class="hint">通道编码 34020000001320000088</span>
        </div>
        <div class="detail-grid">
          <section class="detail-pane">
            <h3>治理信息</h3>
            <el-form label-width="88px">
              <el-form-item label="治理名称">
                <div class="field-line">
                  <el-input v-model="gName" maxlength="50" show-word-limit :disabled="!showName" placeholder="为空时列表显示原始名称"/>
                  <el-tooltip v-if="showName" content="清空治理名称。列表改显示原始名称，不把原始名称抄过来。" placement="top">
                    <el-button link class="icon-btn" @click="resetName"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg></el-button>
                  </el-tooltip>
                  <el-tooltip v-if="showName" content="按当前目录的命名规则预览" placement="top">
                    <el-button link class="icon-btn" @click="previewDeviceName"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg></el-button>
                  </el-tooltip>
                  <span class="origin-inline">原始：西湖小区东门监控</span>
                </div>
              </el-form-item>
              <el-form-item label="管理单位">
                <el-tree-select v-model="unitId" :data="unitTree" :render-after-expand="false" placeholder="请选择叶子单位" style="width:100%"/>
                <div class="hint">只绑定启用的叶子单位。</div>
              </el-form-item>
              <el-form-item label="业务标签">
                <el-tree-select v-model="tagIds" :data="tagTree" multiple show-checkbox :render-after-expand="false" placeholder="请选择叶子标签" style="width:100%"/>
                <div class="hint">来自业务标签字典。只选启用的叶子，同一字典可多选。</div>
              </el-form-item>
              <el-form-item label="设备类型">
                <div class="field-line">
                  <el-select v-model="gType"><el-option v-for="t in ['枪机','半球','球机','鹰眼','全景','梯半球','针孔']" :key="t" :label="t" :value="t"/></el-select>
                  <el-tooltip content="按原始类型回填。对不上类型字典就清空。" placement="top">
                    <el-button link class="icon-btn" @click="resetType"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg></el-button>
                  </el-tooltip>
                  <span class="origin-inline">原始：枪机</span>
                </div>
              </el-form-item>
              <el-form-item label="厂商">
                <div class="field-line">
                  <el-input model-value="海康威视" maxlength="50" show-word-limit/>
                  <span class="origin-inline">原始：海康</span>
                </div>
              </el-form-item>
              <el-form-item label="安装日期"><el-date-picker type="date" model-value="2024-05-01" style="width:100%"/></el-form-item>
              <el-form-item label="维保到期"><el-date-picker type="date" model-value="2027-05-01" style="width:100%"/></el-form-item>
              <el-form-item label="缩略图" class="thumb-item">
                <el-upload class="thumb-upload" action="#" list-type="picture-card" :auto-upload="false" :limit="1" accept="image/*" :file-list="thumbFiles" :on-change="onThumbChange" :on-remove="onThumbRemove">
                  <span class="upload-plus">+</span>
                </el-upload>
              </el-form-item>
            </el-form>
            <div class="sync-line">
              <span>同步：已同步 · 手动 · 2026-10-27 18:20:11</span>
              <el-button v-if="canSync" link type="primary" @click="syncLogOpen=true">同步日志</el-button>
            </div>
          </section>
          <section class="detail-pane">
            <h3>位置</h3>
            <el-form label-width="88px">
              <div class="area-address">
                <div class="aa-item">
                  <span class="aa-label">行政区划</span>
                  <el-input class="root-lock" model-value="浙江省" disabled/>
                  <el-cascader class="area-cascader" v-model="areaPath" :options="areaOptions" :props="areaProps" clearable separator=" / " placeholder="从市开始选" @change="onAreaChange"/>
                </div>
                <div class="aa-item is-address">
                  <span class="aa-label">详细地址</span>
                  <el-input model-value="文三路 100 号" maxlength="200" show-word-limit placeholder="最多 200 字"/>
                </div>
              </div>
              <div class="hint">从市开始选，可停在市或区县。改区划只移动地图。</div>
              <el-form-item label="治理坐标">
                <div class="field-line">
                  <el-input class="coord-input" v-model="lng" placeholder="经度 73–135"/>
                  <el-input class="coord-input" v-model="lat" placeholder="纬度 3–54"/>
                  <el-tooltip content="清空治理经纬度，不抄原始坐标。" placement="top">
                    <el-button link class="icon-btn" @click="resetCoord"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg></el-button>
                  </el-tooltip>
                </div>
                <div class="hint">原始坐标 120.130100，30.279200</div>
              </el-form-item>
              <div class="loc-media">
                <div>
                  <div class="media-label">直播</div>
                  <div class="live is-wide">在线画面。对照旁边的地图，确认这个点在哪。</div>
                </div>
                <div>
                  <div class="media-label">地图</div>
                  <div class="map is-wide" @click="onMap"><div class="pin" style="left:46%;top:58%"></div></div>
                </div>
              </div>
              <div class="detail-actions">
                <el-button link type="primary" @click="fillArea">用坐标填区划</el-button>
                <span v-if="!geoWarn" class="hint">点击落点预览，暂不写入坐标。</span>
              </div>
              <el-alert v-if="geoWarn" style="margin-bottom:8px" type="warning" :closable="false" title="不在已选行政区划内，反查到余杭区。可以保存。"/>
            </el-form>
          </section>
        </div>
      </section>

      <section v-show="page==='coord'">
        <div class="coord-stage">
          <div class="tree-card">
            <el-radio-group v-if="mode==='three'" v-model="catalog" size="small" style="margin-bottom:8px">
              <el-radio-button label="original">原始</el-radio-button>
              <el-radio-button label="base">基础</el-radio-button>
              <el-radio-button label="business">业务</el-radio-button>
            </el-radio-group>
            <el-select v-if="mode==='three' && catalog==='business'" v-model="bizId" style="width:100%;margin-bottom:8px">
              <el-option v-for="b in bizCatalogs" :key="b.id" :label="b.name" :value="b.id"/>
            </el-select>
            <el-input v-model="coordKw" placeholder="搜索目录" clearable style="margin-bottom:8px"/>
            <el-tree v-if="coordTree.length" :key="catalog + bizId + coordKw" :data="coordTree" node-key="id" :current-node-key="coordNodeId" default-expand-all highlight-current :expand-on-click-node="false" @node-click="pickCoordNode">
              <template #default="{ data }"><span class="tree-node">{{ data.label }}<em>待治理 {{ coordTodoNum(data.id) }}</em></span></template>
            </el-tree>
            <div v-else class="hint">没有匹配的目录</div>
          </div>
          <div class="coord-stage-main">
            <div class="map coord-bg" @click="pickOnMap">
              <div class="pin" :style="coordPin"></div>
              <el-input class="map-search" placeholder="输入地点名称，只移动地图" style="width:280px" @click.stop @keyup.enter="ElMessage.info('只移动地图，不写入这台设备的坐标')"/>
            </div>
            <div class="coord-float">
              <div class="list-card">
                <div class="page-head">
                  <h2>目录设备列表</h2>
                  <el-radio-group v-model="queue" size="small">
                    <el-radio-button label="todo">待治理 {{ queueCount('todo') }}</el-radio-button>
                    <el-radio-button label="done">已有坐标 {{ queueCount('done') }}</el-radio-button>
                    <el-radio-button label="na">不适用 {{ queueCount('na') }}</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="coord-table">
                <el-table :data="visibleQueue" highlight-current-row height="100%" @row-click="pickQueue">
                  <el-table-column prop="name" label="设备名称" min-width="168"/>
                  <el-table-column label="治理状态" width="88"><template #default="{ row }"><el-tag :type="row.q==='done'?'success':row.q==='na'?'info':'warning'" size="small">{{ row.gov }}</el-tag></template></el-table-column>
                  <el-table-column prop="org" label="上级组织" width="108"/>
                  <el-table-column prop="lnglat" label="经纬度" width="168"/>
                </el-table>
                </div>
              </div>
              <div class="list-card">
                <div class="page-head"><h2>设备信息</h2></div>
                <div class="coord-info-body">
                  <div class="live">{{ currentCoord.online ? '点击播放预览' : '设备离线，无法预览' }}</div>
                  <div class="coord-meta">
                    <div><span>设备名称</span><b>{{ currentCoord.name }}</b></div>
                    <div><span>在线</span><b>{{ currentCoord.online ? '在线' : '离线' }}</b></div>
                    <div><span>设备类型</span><b>{{ currentCoord.type }}</b></div>
                    <div><span>上级组织</span><b>{{ currentCoord.org }}</b></div>
                    <div><span>上级平台</span><b>{{ currentCoord.platform }}</b></div>
                    <div class="wide"><span>设备编码</span><b>{{ currentCoord.code }}</b></div>
                    <div class="wide"><span>经纬度</span><b>{{ coordLng && coordLat ? coordLng + '，' + coordLat : '—' }}</b></div>
                    <div class="wide hint">{{ coordViewHint }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="coord-actions" @click.stop>
              <el-input v-model="coordLng" placeholder="经度 73–135" style="width:148px" @input="onCoordType"/>
              <el-input v-model="coordLat" placeholder="纬度 3–54" style="width:132px" @input="onCoordType"/>
              <el-tooltip :disabled="coordCanReuse" content="上一台还没有已保存的坐标" placement="top">
                <span class="op-tip"><el-button :disabled="!coordCanReuse" @click.stop="reusePrevCoord">沿用上一台</el-button></span>
              </el-tooltip>
              <el-button @click.stop="naOpen=true">不适用</el-button>
              <el-button @click.stop="skipCoord">跳过</el-button>
              <el-button type="primary" @click.stop="saveCoord">保存该设备点位</el-button>
            </div>
          </div>
        </div>
      </section>

      <section v-show="page==='ai'" class="ai-section">
        <div class="split ai-page">
        <div class="tree-card">
          <el-radio-group v-if="mode==='three'" v-model="catalog" size="small" style="margin-bottom:8px">
            <el-radio-button label="original">原始</el-radio-button>
            <el-radio-button label="base">基础</el-radio-button>
            <el-radio-button label="business">业务</el-radio-button>
          </el-radio-group>
          <el-select v-if="mode==='three' && catalog==='business'" v-model="bizId" style="width:100%;margin-bottom:8px">
            <el-option v-for="b in bizCatalogs" :key="b.id" :label="b.name" :value="b.id"/>
          </el-select>
          <el-input placeholder="组织名称" style="margin-bottom:8px"/>
          <el-tree :key="catalog + bizId" :data="tree" default-expand-all highlight-current>
            <template #default="{ data }"><span class="tree-node">{{ data.label }}<em>待标注 {{ aiTodoCount(data) }}</em></span></template>
          </el-tree>
        </div>
        <div class="right-col">
        <div class="stats">
          <div class="stat"><div><div class="k">待标注</div><div class="n">{{ aiCounts.wait }}</div></div></div>
          <div class="stat"><div><div class="k">标注中</div><div class="n">{{ aiCounts.ing }}</div></div></div>
          <div class="stat"><div><div class="k">待人工确认</div><div class="n">{{ aiCounts.confirm }}</div></div></div>
          <div class="stat"><div><div class="k">已确认</div><div class="n">{{ aiCounts.done }}</div></div></div>
        </div>
        <div class="list-card">
          <el-radio-group v-model="aiTab" @change="onAiTab">
            <el-radio-button label="all">全部 {{ aiCounts.all }}</el-radio-button>
            <el-radio-button label="wait">待标注 {{ aiCounts.wait }}</el-radio-button>
            <el-radio-button label="ing">标注中 {{ aiCounts.ing }}</el-radio-button>
            <el-radio-button label="confirm">待确认 {{ aiCounts.confirm }}</el-radio-button>
            <el-radio-button label="done">已确认 {{ aiCounts.done }}</el-radio-button>
          </el-radio-group>
          <div class="filters" style="margin-top:12px">
            <el-input placeholder="请输入设备名称" style="width:200px"/>
            <el-select placeholder="请选择在线状态" style="width:160px" clearable><el-option label="在线" value="on"/><el-option label="离线" value="off"/></el-select>
            <el-tree-select v-if="aiTab==='all'||aiTab==='confirm'||aiTab==='done'" v-model="aiTagFilterIds" :data="tagTree" multiple show-checkbox clearable placeholder="请选择标签" style="width:220px"/>
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </div>
          <div v-if="aiCanSelect" class="ai-bar">
            <el-button link type="primary" @click="aiPickPage">选中本页</el-button>
            <el-button link type="primary" @click="aiPickAll">选中全部</el-button>
            <span class="spacer"></span>
            <span class="hint">{{ aiScopeText() }}</span>
            <el-button :disabled="!aiSelectedCount" @click="runAiBatch">{{ aiTab==='confirm' ? '批量确认' : '批量发起标注' }}</el-button>
          </div>
          <div class="ai-table">
          <el-table :key="aiTab" ref="aiTable" :data="aiRows" row-key="code" height="100%" @selection-change="onAiSelect">
            <el-table-column v-if="aiCanSelect" type="selection" width="42"/>
            <el-table-column prop="code" label="设备编码" width="210"/>
            <el-table-column prop="name" label="设备名称" min-width="140"/>
            <el-table-column label="业务标签建议" min-width="180">
              <template #default="{ row }"><span class="ai-tags"><el-tag v-for="t in row.tags" :key="t" size="small" type="success">{{ t }}</el-tag></span></template>
            </el-table-column>
            <el-table-column label="标注状态" width="150">
              <template #default="{ row }"><el-tag :type="aiStType(row.st)" size="small">{{ row.st }}</el-tag><el-tag v-if="row.fail" size="small" type="danger" style="margin-left:4px">上次失败</el-tag></template>
            </el-table-column>
            <el-table-column label="设备状态" width="90">
              <template #default="{ row }"><el-tag :type="row.online==='在线'?'success':'info'" size="small">{{ row.online }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="time" label="最后标注时间" width="170"/>
            <el-table-column v-if="aiTab==='done'" prop="confirmTime" label="确认时间" width="170"/>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button v-if="row.op==='start'" link type="primary" @click="startAi(row)">发起标注</el-button>
                <el-button v-else-if="row.op==='confirm'" link type="primary" @click="openAi(row)">确认</el-button>
                <el-button v-else-if="row.op==='view'" link type="primary" @click="openAi(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="aiCounts[aiTab]" :default-page-size="20" :page-sizes="[20,30,50]"/></div>
        </div>
        </div>
        </div>
      </section>

      <section v-show="page==='area'" class="area-section">
        <div class="split area-page">
          <div class="tree-card area-tree">
            <el-input placeholder="名称或编码搜索"/>
            <el-checkbox>显示已停用</el-checkbox>
            <el-tree :data="areaAdminTree" node-key="id" :current-node-key="areaSel" default-expand-all highlight-current @node-click="pickArea">
              <template #default="{ data }"><span class="tree-node"><span>{{ data.label }}</span><em>{{ data.code }}</em></span></template>
            </el-tree>
            <div class="area-foot">
              <el-button type="primary" style="width:100%" @click="areaCreateOpen=true">+ 新增子节点</el-button>
              <div class="area-foot-row">
                <el-button type="primary" plain @click="ElMessage.info('可改名称，编码不可改')">编辑</el-button>
                <el-button type="danger" plain @click="ElMessage.warning(areaSelNode.deep===0?'项目根不能停用':'停用后下级一并停用')">停用</el-button>
                <el-button type="danger" plain @click="ElMessage.warning(areaSelNode.deep===0?'项目根不能删除':'请先处理下级')">删除</el-button>
              </div>
            </div>
          </div>
          <div class="list-card area-main">
            <div class="area-zoom-btn"><el-button type="primary" @click="zoomOpen=true">按级设置缩放</el-button></div>
            <div v-if="areaSelNode.deep < 2" class="area-fill">
              <h3 class="area-title">节点信息</h3>
              <div class="area-meta">
                <span><span class="lab">区划名称</span><el-input :model-value="areaSelNode.label" disabled/></span>
                <span><span class="lab">区划编码</span>{{ areaSelNode.code }}</span>
                <span><span class="lab">层级</span>{{ ['省','市','区县','乡镇/街道'][areaSelNode.deep] }}</span>
                <span><span class="lab">状态</span><el-tag type="success" size="small">启用</el-tag></span>
              </div>
              <h3 class="area-title">视口参数</h3>
              <div class="area-meta">
                <span><span class="lab">中心经度</span><el-input model-value="120.153576" placeholder="中国境内 [73,136]"/></span>
                <span><span class="lab">中心纬度</span><el-input model-value="30.287459" placeholder="中国境内 [3,54]"/></span>
                <span><span class="lab">缩放级别</span><el-input-number :model-value="areaSelNode.deep===0?8:11" :min="1" :max="20" :step="1"/></span>
              </div>
              <div class="area-map-fit">
                <div class="map">
                  <div class="map-banner">预览按门户 1920×1080 画布等比缩小。拖拽平移，滚动缩放；保存时写入当前地图中心与缩放。</div>
                  <div class="map-cross"></div>
                  <div class="map-foot"><span>当前中心：经度 120.153576 / 纬度 30.287459　　缩放级别：{{ areaSelNode.deep===0?8:11 }}</span><el-button type="primary" size="small" @click="ElMessage.success('已把当前地图中心回填到表单，尚未保存')">回填数据</el-button></div>
                </div>
              </div>
              <div class="area-save">
                <el-button type="primary" @click="ElMessage.success('视口参数已保存')">保存视口参数</el-button>
              </div>
            </div>
            <div v-else-if="areaSelNode.deep === 2" class="area-county" :class="{ 'is-towns': areaTab==='towns' }">
              <el-tabs v-model="areaTab" class="area-tabs">
                <el-tab-pane label="区县详情" name="detail">
                  <div class="area-fill">
                    <h3 class="area-title">区县节点信息</h3>
                    <div class="area-meta">
                      <span><span class="lab">区划名称</span><el-input :model-value="areaSelNode.label" disabled/></span>
                      <span><span class="lab">区划编码</span>{{ areaSelNode.code }}</span>
                      <span><span class="lab">层级</span>区县</span>
                      <span><span class="lab">状态</span><el-tag type="success" size="small">启用</el-tag></span>
                    </div>
                    <h3 class="area-title">区县视口参数</h3>
                    <div class="area-meta">
                      <span><span class="lab">中心经度</span><el-input model-value="120.130000" placeholder="中国境内 [73,136]"/></span>
                      <span><span class="lab">中心纬度</span><el-input model-value="30.259000" placeholder="中国境内 [3,54]"/></span>
                      <span><span class="lab">缩放级别</span><el-input-number :model-value="12" :min="1" :max="20" :step="1"/></span>
                    </div>
                    <div class="area-map-fit">
                      <div class="map">
                        <div class="map-banner">预览按门户 1920×1080 画布等比缩小。拖拽平移，滚动缩放；保存时写入当前地图中心与缩放。</div>
                        <div class="map-cross"></div>
                        <div class="map-foot"><span>当前中心：经度 120.130000 / 纬度 30.259000　　缩放级别：12</span><el-button type="primary" size="small" @click="ElMessage.success('已把当前地图中心回填到表单，尚未保存')">回填数据</el-button></div>
                      </div>
                    </div>
                    <div class="area-save">
                      <el-button type="primary" @click="ElMessage.success('视口参数已保存')">保存视口参数</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="towns">
                  <template #label>乡镇/街道 {{ areaSel==='yh'?1:3 }}</template>
                  <div class="filters" style="margin-bottom:8px">
                    <span class="hint">乡镇/街道列表（{{ areaSelNode.code }} {{ areaSelNode.label }}）</span>
                    <el-input placeholder="请输入名称" style="width:140px"/>
                    <el-input placeholder="请输入编码" style="width:140px"/>
                    <el-button type="primary" plain>查询</el-button>
                    <el-button type="danger" plain>重置</el-button>
                    <span class="grow"></span>
                    <el-button type="primary" @click="areaCreateOpen=true">+ 新增</el-button>
                  </div>
                  <el-table v-if="areaSel!=='yh'" :data="[{name:'西溪街道',code:'330106001',lng:'120.063000',lat:'30.272000',zoom:14},{name:'北山街道',code:'330106008',lng:'120.142000',lat:'30.258000',zoom:14},{name:'留下街道',code:'330106010',lng:'—',lat:'—',zoom:'—'}]" highlight-current-row>
                    <el-table-column prop="code" label="区划/街道编码" width="140"/>
                    <el-table-column prop="name" label="区划名称"/>
                    <el-table-column label="状态" width="80"><template #default><el-tag type="success" size="small">启用</el-tag></template></el-table-column>
                    <el-table-column prop="lng" label="中心经度" width="120"/>
                    <el-table-column prop="lat" label="中心纬度" width="120"/>
                    <el-table-column prop="zoom" label="缩放级别" width="90"/>
                    <el-table-column label="操作" width="160"><template #default><el-button link type="primary">编辑</el-button><el-button link type="primary">停用</el-button><el-button link type="danger">删除</el-button></template></el-table-column>
                  </el-table>
                  <el-table v-else :data="[{name:'仓前街道',code:'330110005',lng:'120.001000',lat:'30.280000',zoom:14}]" highlight-current-row>
                    <el-table-column prop="code" label="区划/街道编码" width="140"/>
                    <el-table-column prop="name" label="区划名称"/>
                    <el-table-column label="状态" width="80"><template #default><el-tag type="success" size="small">启用</el-tag></template></el-table-column>
                    <el-table-column prop="lng" label="中心经度" width="120"/>
                    <el-table-column prop="lat" label="中心纬度" width="120"/>
                    <el-table-column prop="zoom" label="缩放级别" width="90"/>
                    <el-table-column label="操作" width="160"><template #default><el-button link type="primary">编辑</el-button><el-button link type="primary">停用</el-button><el-button link type="danger">删除</el-button></template></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
              <div v-if="areaTab==='towns'" class="area-fill area-town-detail">
                <div class="area-meta">
                  <span><span class="lab">中心经度</span><el-input model-value="120.063000" placeholder="中国境内 [73,136]"/></span>
                  <span><span class="lab">中心纬度</span><el-input model-value="30.272000" placeholder="中国境内 [3,54]"/></span>
                  <span><span class="lab">缩放级别</span><el-input-number :model-value="14" :min="1" :max="20" :step="1"/></span>
                </div>
                <div class="area-map-fit">
                  <div class="map">
                    <div class="map-banner">预览按门户 1920×1080 画布等比缩小。拖拽平移，滚动缩放；保存时写入当前地图中心与缩放。</div>
                    <div class="map-cross"></div>
                    <div class="map-foot"><span>当前中心：经度 120.063000 / 纬度 30.272000　　缩放级别：14</span><el-button type="primary" size="small" @click="ElMessage.success('已把当前地图中心回填到表单，尚未保存')">回填数据</el-button></div>
                  </div>
                </div>
                <div class="area-save">
                  <el-button @click="ElMessage.info('已切到下一个街道')">下一个</el-button>
                  <el-button type="primary" @click="ElMessage.success('视口参数已保存')">保存视口参数</el-button>
                </div>
              </div>
            </div>
            <div v-else class="area-fill">
              <h3 class="area-title">{{ areaSelNode.label }}</h3>
              <div class="area-meta">
                <span><span class="lab">区划名称</span><el-input :model-value="areaSelNode.label" disabled/></span>
                <span><span class="lab">区划编码</span>{{ areaSelNode.code }}</span>
                <span><span class="lab">层级</span>乡镇/街道</span>
                <span><span class="lab">状态</span><el-tag type="success" size="small">启用</el-tag></span>
              </div>
              <h3 class="area-title">视口参数</h3>
              <div class="area-meta">
                <span><span class="lab">中心经度</span><el-input model-value="120.063000" placeholder="中国境内 [73,136]"/></span>
                <span><span class="lab">中心纬度</span><el-input model-value="30.272000" placeholder="中国境内 [3,54]"/></span>
                <span><span class="lab">缩放级别</span><el-input-number :model-value="14" :min="1" :max="20" :step="1"/></span>
              </div>
              <div class="area-map-fit">
                <div class="map">
                  <div class="map-banner">预览按门户 1920×1080 画布等比缩小。拖拽平移，滚动缩放；保存时写入当前地图中心与缩放。</div>
                  <div class="map-cross"></div>
                  <div class="map-foot"><span>当前中心：经度 120.063000 / 纬度 30.272000　　缩放级别：14</span><el-button type="primary" size="small" @click="ElMessage.success('已把当前地图中心回填到表单，尚未保存')">回填数据</el-button></div>
                </div>
              </div>
              <div class="area-save">
                <el-button @click="ElMessage.info('已切到下一个街道')">下一个</el-button>
                <el-button type="primary" @click="ElMessage.success('视口参数已保存')">保存视口参数</el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-show="page==='unit'||page==='tag'">
        <div class="split org-page">
          <div class="tree-card org-tree">
            <div class="tree-hd">{{ page==='unit'?'单位树':'标签树' }}</div>
            <el-input v-model="orgKw" placeholder="搜索名称" clearable style="margin-bottom:8px"/>
            <el-select v-model="orgStatus" placeholder="启用状态" clearable style="width:100%;margin-bottom:8px">
              <el-option label="启用" value="on"/>
              <el-option label="停用" value="off"/>
            </el-select>
            <el-tree :data="orgTree" node-key="id" :current-node-key="orgNode.id" default-expand-all highlight-current :expand-on-click-node="false" @node-click="pickOrg">
              <template #default="{ data }"><span class="tree-node"><span>{{ data.label }}</span><el-tag v-if="data.dict" size="small">{{ data.code }}</el-tag><el-tag v-if="!data.on" size="small" type="info">停用</el-tag><em>{{ orgNodeLeaf(data) ? data.direct + '台' : ((data.children ? data.children.length : 0) + (page==='unit' ? '个单位' : '个子标签')) }}</em></span></template>
            </el-tree>
          </div>
          <div class="list-card org-main">
            <div class="page-head">
              <div>
                <h2>{{ orgNode.label }} <el-tag size="small" :type="orgKindText==='叶子'?'':'info'">{{ orgKindText }}</el-tag> <el-tag size="small" :type="orgNode.on?'success':'info'">{{ orgNode.on?'启用':'停用' }}</el-tag> <el-tag v-if="orgNode.builtin" size="small">预置</el-tag></h2>
                <div class="crumbs">
                  <template v-for="(p,i) in orgPath" :key="p.id">
                    <span v-if="i"> / </span>
                    <a v-if="i < orgPath.length-1" @click="pickOrg(p)">{{ p.label }}</a>
                    <span v-else>{{ p.label }}</span>
                  </template>
                </div>
                <div v-if="page==='tag' && orgNode.dict" class="hint">编码 {{ orgNode.code }} · 最大 {{ orgNode.maxLevel }} 级（含字典自身）· 预置字典不能删除</div>
                <div v-else-if="page==='tag' && orgDict" class="hint">{{ orgDict.label }} {{ orgDict.code }} · 当前 L{{ orgNode.level }} / 最大 L{{ orgDict.maxLevel }} · {{ orgBindLeaf ? '叶子，可绑定设备' : '分类，不能绑定设备' }}</div>
                <div class="org-metrics">
                  <span>{{ page==='unit'?'下级单位':'下级标签' }} <b>{{ orgNode.children ? orgNode.children.length : 0 }}</b> 个</span>
                  <span>直接绑定 <b>{{ orgNode.direct }}</b> 台</span>
                  <span>含下级 <b>{{ orgNode.total }}</b> 台</span>
                </div>
              </div>
              <span class="spacer"></span>
              <el-button v-if="page==='tag'" @click="orgAddDict">新增标签字典</el-button>
              <el-button type="primary" :disabled="!orgCanAdd" @click="orgAdd">新增下级</el-button>
              <el-button @click="orgEdit()">编辑</el-button>
              <el-button @click="orgStop()">{{ orgNode.on?'停用':'启用' }}</el-button>
              <el-button type="danger" plain :disabled="!!orgNode.builtin" @click="orgRemove()">删除</el-button>
            </div>
            <div v-if="orgAddHint" class="org-note">{{ orgAddHint }}</div>
            <div class="org-body">
              <el-tabs v-if="!orgBindLeaf" v-model="orgPane" class="org-tabs">
                <el-tab-pane :label="'下级 ' + (orgNode.children ? orgNode.children.length : 0) + ' 个'" name="children">
                  <div class="org-pane">
                    <el-table :data="orgNode.children || []" height="100%">
                      <el-table-column prop="label" label="名称"/>
                      <el-table-column label="层级" width="90"><template #default="{ row }">第 {{ row.level }} 级</template></el-table-column>
                      <el-table-column label="状态" width="90"><template #default="{ row }"><el-tag size="small" :type="row.on?'success':'info'">{{ row.on?'启用':'停用' }}</el-tag></template></el-table-column>
                      <el-table-column label="直接绑定" width="110"><template #default="{ row }">{{ row.direct }} 台</template></el-table-column>
                      <el-table-column label="含下级" width="100"><template #default="{ row }">{{ row.total }} 台</template></el-table-column>
                      <el-table-column label="操作" width="220">
                        <template #default="{ row }">
                          <el-button link type="primary" @click="pickOrg(row)">查看</el-button>
                          <el-button link type="primary" @click="orgEdit(row)">编辑</el-button>
                          <el-button link type="primary" @click="orgStop(row)">{{ row.on?'停用':'启用' }}</el-button>
                          <el-button link type="danger" :disabled="!!row.builtin" @click="orgRemove(row)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="'绑定设备 ' + orgBound.length + ' 台'" name="devices">
                  <div class="org-pane">
                    <div class="org-tools">
                      <span class="hint">分类节点不能作为绑定目标。这里是下级叶子上的设备，只含同步正常的。</span>
                      <span class="spacer"></span>
                      <el-button :disabled="!orgChecked.length" @click="unbindOrg(false)">解绑所选</el-button>
                      <el-button type="danger" plain :disabled="!orgBound.length" @click="unbindOrg(true)">解绑当前结果</el-button>
                    </div>
                    <el-table :data="orgBound" height="100%" @selection-change="orgChecked=$event">
                      <el-table-column type="selection" width="42"/>
                      <el-table-column prop="name" label="设备名称"/>
                      <el-table-column prop="at" :label="page==='unit'?'直接绑定单位':'直接绑定标签'"/>
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div v-else class="org-pane">
                <div class="org-tools">
                  <span class="hint">只含同步正常的设备。解绑后按完成清单重算治理状态。</span>
                  <span class="spacer"></span>
                  <el-button :disabled="!orgChecked.length" @click="unbindOrg(false)">解绑所选</el-button>
                  <el-button type="danger" plain :disabled="!orgBound.length" @click="unbindOrg(true)">解绑当前结果</el-button>
                </div>
                <el-table :data="orgBound" height="100%" @selection-change="orgChecked=$event">
                  <el-table-column type="selection" width="42"/>
                  <el-table-column prop="name" label="设备名称"/>
                  <el-table-column prop="at" :label="page==='unit'?'直接绑定单位':'直接绑定标签'"/>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-show="page==='tasks'">
        <div class="stats">
          <div class="stat"><div><div class="k">草稿任务</div><div class="n">1</div></div></div>
          <div class="stat"><div><div class="k">已派发</div><div class="n">1</div></div></div>
          <div class="stat"><div><div class="k">绑定设备</div><div class="n">116</div></div></div>
          <div class="stat"><div><div class="k">已完成设备</div><div class="n">20</div></div></div>
        </div>
        <div class="list-card">
          <div class="filters">
            <el-input placeholder="请输入任务名称" style="width:200px"/>
            <el-select placeholder="请选择任务状态" style="width:150px"><el-option label="草稿" value="0"/><el-option label="已派发" value="1"/></el-select>
            <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px"/>
            <span class="grow"></span>
            <el-button type="primary" plain>查询</el-button>
            <el-button type="danger" plain>重置</el-button>
          </div>
          <div class="tools">
            <el-button type="primary" @click="go('group','治理任务')">用户组配置</el-button>
            <el-button type="primary" @click="openTaskCreate">创建任务</el-button>
          </div>
          <el-table :data="taskRows">
            <el-table-column prop="name" label="任务名称" min-width="160">
              <template #default="{ row }"><div class="cell-2l"><div>{{ row.name }}</div><div class="cell-sub">{{ row.code }}</div></div></template>
            </el-table-column>
            <el-table-column label="任务状态" width="100"><template #default="{row}"><el-tag :type="tagType(row.st)" size="small">{{ row.st }}</el-tag></template></el-table-column>
            <el-table-column prop="who" label="治理人" width="100"/>
            <el-table-column prop="creator" label="创建人" width="90"/>
            <el-table-column prop="items" label="治理项" min-width="150" show-overflow-tooltip/>
            <el-table-column prop="n" label="设备数" width="80"/>
            <el-table-column prop="time" label="创建时间" width="160"/>
            <el-table-column label="操作" width="360" fixed="right"><template #default="{row}">
              <template v-if="row.st==='草稿'">
                <el-button link type="primary" @click="openTaskEdit(row)">编辑</el-button>
                <el-button link type="primary" @click="openDeviceConfig(row)">配置设备</el-button>
                <el-tooltip content="请先配置至少 1 台设备" placement="top" :disabled="!!row.n"><span class="op-tip"><el-button link type="primary" :disabled="!row.n" @click="openTaskPrefill(row)">预填</el-button></span></el-tooltip>
                <el-tooltip content="请先配置至少 1 台设备" placement="top" :disabled="!!row.n"><span class="op-tip"><el-button link type="primary" :disabled="!row.n" @click="openDispatch(row)">派单</el-button></span></el-tooltip>
                <el-button link type="danger" @click="ElMessageBox.confirm('确认删除「'+row.name+'」吗？删除后不可恢复。','确认删除？',{confirmButtonText:'确定',cancelButtonText:'取消',confirmButtonClass:'el-button--danger',closeOnClickModal:false}).then(()=>ElMessage.success('删除成功')).catch(()=>{})">删除</el-button>
              </template>
              <el-button link type="primary" @click="openTaskDetail(row)">查看详情</el-button>
            </el-table-column>
          </el-table>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="2" :default-page-size="20" :page-sizes="[10,20,50]"/></div>
        </div>
      </section>

      <section v-show="page==='work'">
        <el-tabs v-model="workTab">
          <el-tab-pane :label="'待我治理 (' + taskRows.filter(function(r){return r.dispatched}).length + ')'" name="govern"/>
          <el-tab-pane label="待我审核 (1)" name="audit"/>
          <el-tab-pane label="全部清单" name="all"/>
        </el-tabs>
        <div class="stats">
          <template v-if="workTab==='govern'">
            <div class="stat"><div><div class="k">任务数</div><div class="n">{{ workGovStats.tasks }}</div></div></div>
            <div class="stat"><div><div class="k">待治理设备</div><div class="n">{{ workGovStats.pending }}</div></div></div>
            <div class="stat"><div><div class="k">已暂存</div><div class="n">{{ workGovStats.saved }}</div></div></div>
            <div class="stat"><div><div class="k">已退回</div><div class="n">{{ workGovStats.rejected }}</div></div></div>
          </template>
          <template v-else-if="workTab==='audit'">
            <div class="stat"><div><div class="k">任务数</div><div class="n">1</div></div></div>
            <div class="stat"><div><div class="k">待审核设备</div><div class="n">20</div></div></div>
            <div class="stat"><div><div class="k">退回重交</div><div class="n">3</div></div></div>
            <div class="stat"><div><div class="k">完成率%</div><div class="n">18.6</div></div></div>
          </template>
          <template v-else>
            <div class="stat"><div><div class="k">任务总数</div><div class="n">{{ taskRows.length }}</div></div></div>
            <div class="stat"><div><div class="k">进行中</div><div class="n">{{ workGovStats.tasks }}</div></div></div>
            <div class="stat"><div><div class="k">待审核设备</div><div class="n">20</div></div></div>
            <div class="stat"><div><div class="k">已完成设备</div><div class="n">20</div></div></div>
          </template>
        </div>
        <div class="list-card">
          <div class="filters">
            <el-input placeholder="请输入任务名称" style="width:200px"/>
            <el-select v-if="workTab==='all'" v-model="workRole" placeholder="请选择我的角色" clearable style="width:160px"><el-option label="创建人" value="创建人"/><el-option label="治理人" value="治理人"/><el-option label="审核人" value="审核人"/></el-select>
            <span class="grow"></span>
            <el-button type="primary" plain>查询</el-button>
            <el-button type="danger" plain>重置</el-button>
          </div>
          <el-table :data="workRows" style="margin-top:12px">
            <el-table-column prop="name" label="任务名称" min-width="160">
              <template #default="{ row }"><div class="cell-2l"><div>{{ row.name }}</div><div class="cell-sub">{{ row.code }}</div></div></template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" width="90"/>
            <el-table-column prop="who" label="治理人" width="90"/>
            <el-table-column prop="n" label="设备数" width="80"/>
            <el-table-column label="任务状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.st)" size="small">{{ row.st }}</el-tag></template></el-table-column>
            <el-table-column prop="items" label="治理项" min-width="170" show-overflow-tooltip/>
            <el-table-column v-if="workTab==='all'" label="我的角色" width="130">
              <template #default="{ row }"><el-tag size="small" type="info" effect="plain">{{ (row.roles || []).join(' · ') }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="110"><template #default="{ row }">
              <el-button v-if="workTab==='govern'" link type="primary" @click="openGovern(row)">去治理</el-button>
              <el-button v-else-if="workTab==='audit'" link type="primary" @click="go('audit','治理任务')">去审核</el-button>
              <el-button v-else link type="primary" @click="openTaskDetail(row)">查看</el-button>
            </template></el-table-column>
          </el-table>
        </div>
      </section>

      <section v-show="page==='taskDetail'">
        <div class="list-card td-head">
          <div class="td-head-top">
            <h2>{{ taskDetailTask ? taskDetailTask.name : '任务详情' }}</h2>
            <el-tag :type="taskDetailStats.dispatched ? 'success' : 'info'" size="small">{{ taskDetailTask ? taskDetailTask.st : '—' }}</el-tag>
            <el-tag v-if="taskDetailStats.dispatched && taskDetailStats.rate>=100" type="success" size="small" effect="plain">已完成</el-tag>
            <span class="spacer"></span>
            <el-button v-if="taskDetailStats.dispatched" type="primary" @click="openGovern(taskDetailTask)">进入治理</el-button>
            <el-button v-if="taskDetailStats.dispatched" @click="go('audit','治理任务')">进入审核</el-button>
            <el-button @click="go('tasks','治理任务')">返回</el-button>
          </div>
          <div class="td-meta">
            <span>任务编码：<b>{{ taskDetailTask ? (taskDetailTask.code || '—') : '—' }}</b></span>
            <span>创建人：<b>{{ taskDetailTask ? taskDetailTask.creator : '—' }}</b></span>
            <span>治理人：<b>{{ taskDetailTask ? taskDetailTask.who : '—' }}</b></span>
            <span>创建时间：<b>{{ taskDetailTask ? taskDetailTask.time : '—' }}</b></span>
            <span>派单时间：<b>{{ taskDetailStats.dispatched ? '2026-10-26 16:48' : '—' }}</b></span>
            <span>治理项数量：<b>{{ taskDetailItems.length }}</b></span>
            <span>绑定设备数：<b>{{ taskDetailTask ? taskDetailTask.n : 0 }}</b></span>
            <span class="td-scope">派单范围：<el-tooltip :content="taskDetailTask ? (taskDetailTask.scopeFull || '—') : '—'" placement="top"><b>{{ taskDetailTask ? (taskDetailTask.scope || '—') : '—' }}</b></el-tooltip></span>
          </div>
          <div class="gov-tags"><el-tag v-for="g in taskDetailItems" :key="g" size="small">{{ g }}</el-tag></div>
        </div>
        <div class="stats gov-stats">
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && !taskDetailApplied.status }" @click="clearTaskStat"><div><div class="k">总设备数</div><div class="n">{{ taskDetailStats.total }}</div></div></div>
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && taskDetailApplied.status==='0' }" @click="pickTaskStat('0')"><div><div class="k">{{ taskDetailStats.dispatched ? '待治理' : '未派发' }}</div><div class="n warn">{{ taskDetailStats.dispatched ? taskDetailStats.pending : taskDetailStats.undispatched }}</div></div></div>
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && taskDetailApplied.status==='1' }" @click="pickTaskStat('1')"><div><div class="k">已暂存</div><div class="n">{{ taskDetailStats.saved }}</div></div></div>
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && taskDetailApplied.status==='2' }" @click="pickTaskStat('2')"><div><div class="k">待审核</div><div class="n blue">{{ taskDetailStats.reviewing }}</div></div></div>
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && taskDetailApplied.status==='3' }" @click="pickTaskStat('3')"><div><div class="k">已退回</div><div class="n red">{{ taskDetailStats.rejected }}</div></div></div>
          <div class="stat" :class="{ clickable: !!taskDetailStats.dispatched, on: !!taskDetailStats.dispatched && taskDetailApplied.status==='4' }" @click="pickTaskStat('4')"><div><div class="k">已完成</div><div class="n green">{{ taskDetailStats.completed }}</div></div></div>
          <div class="stat"><div><div class="k">完成率</div><div class="n green">{{ taskDetailStats.rate }}<small>%</small></div></div></div>
        </div>
        <div class="list-card">
          <el-alert :type="taskDetailStats.dispatched ? 'info' : 'warning'" show-icon :closable="false" class="gov-hint" :title="taskDetailStats.dispatched ? '本页只读查看任务进度与设备状态，设备行不提供治理/审核操作；要处理请点右上「进入治理 / 进入审核」。点统计卡可按状态筛选下方设备。' : '该任务尚未派单，设备处于「未派发」状态，不进入治理流程；派单后设备才可治理。'"/>
          <div class="filters">
            <el-input v-model="taskDetailQuery.name" placeholder="请输入原始设备名称" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="taskDetailQuery.deviceId" placeholder="请输入平台编码" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="taskDetailQuery.channelId" placeholder="请输入通道编码" clearable maxlength="200" style="width:180px"/>
            <el-select v-model="taskDetailQuery.status" placeholder="请选择设备状态" clearable style="width:160px">
              <template v-if="!taskDetailStats.dispatched"><el-option label="未派发" value="un"/></template>
              <template v-else>
                <el-option label="待治理" value="0"/><el-option label="已暂存" value="1"/><el-option label="待审核" value="2"/><el-option label="已退回" value="3"/><el-option label="已完成" value="4"/>
              </template>
            </el-select>
            <el-button type="primary" plain @click="taskSearch">查询</el-button>
            <el-button type="danger" plain @click="taskReset">重置</el-button>
            <span class="grow"></span>
            <el-button @click="taskExport">导出当前清单</el-button>
          </div>
          <el-table :data="taskPagedView">
            <el-table-column prop="name" label="原始设备名称" min-width="160" show-overflow-tooltip/>
            <el-table-column prop="deviceId" label="平台编码" min-width="170" show-overflow-tooltip/>
            <el-table-column prop="channelId" label="通道编码" min-width="170" show-overflow-tooltip/>
            <el-table-column label="字段进度" width="230">
              <template #header>字段进度 <el-tooltip content="已填写字段数 / 本任务治理项总数，悬停「缺 N 项」看具体缺哪些字段"><span class="th-tip">?</span></el-tooltip></template>
              <template #default="{ row }"><div class="field-progress"><el-progress :percentage="govPercent(row)" :show-text="false" :stroke-width="6" :color="row.filled>=row.total?'#52c41a':''" style="width:64px"/><span>{{ row.filled }}/{{ row.total }}</span>
                <el-tooltip v-if="row.missingList.length" placement="top" effect="light">
                  <template #content><div class="miss-title">还缺 {{ row.missingList.length }} 项</div><div v-for="m in row.missingList" :key="m" class="miss-item">· {{ m }}</div></template>
                  <span class="miss-link">缺 {{ row.missingList.length }} 项</span>
                </el-tooltip>
                <span v-else-if="row.status!=='un'" class="miss-done">已填全</span>
              </div></template>
            </el-table-column>
            <el-table-column label="设备状态" width="110">
              <template #default="{ row }"><el-tag :type="row.status==='un' ? 'info' : govStatusType[row.status]" size="small">{{ taskStatusText(row) }}</el-tag></template>
            </el-table-column>
          </el-table>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes" :total="taskDetailDevices.length" :current-page="taskPage" :page-size="taskPageSize" :page-sizes="[10,20,50]" @current-change="taskPageChange" @size-change="taskSizeChange"/></div>
        </div>
      </section>

      <section v-show="page==='govern'">
        <div class="list-card gov-info">
          <div class="gov-info-hd"><h2>{{ activeGovTask ? activeGovTask.name : '去治理' }}</h2><el-button @click="go('work','治理任务')">返回工作台</el-button></div>
          <div class="gov-meta">
            <span>创建人：<b>{{ activeGovTask ? activeGovTask.creator : '—' }}</b></span>
            <span>治理人：<b>{{ activeGovTask ? activeGovTask.who : '—' }}</b></span>
            <span>治理项数量：<b>{{ activeItemNames.length }}</b></span>
            <span>创建时间：<b>{{ activeGovTask ? activeGovTask.time : '—' }}</b></span>
          </div>
          <div class="gov-tags"><el-tag v-for="g in activeItemNames" :key="g" size="small">{{ g }}</el-tag></div>
        </div>
        <div class="stats gov-stats">
          <div class="stat"><div><div class="k">总设备数</div><div class="n">{{ govStats.total }}</div></div></div>
          <div class="stat"><div><div class="k">待治理</div><div class="n warn">{{ govStats.pending }}</div></div></div>
          <div class="stat"><div><div class="k">已暂存</div><div class="n">{{ govStats.saved }}</div></div></div>
          <div class="stat"><div><div class="k">待审核</div><div class="n blue">{{ govStats.reviewing }}</div></div></div>
          <div class="stat"><div><div class="k">已退回</div><div class="n red">{{ govStats.rejected }}</div></div></div>
          <div class="stat"><div><div class="k">已完成</div><div class="n green">{{ govStats.completed }}</div></div></div>
          <div class="stat"><div><div class="k">完成率</div><div class="n green">{{ govStats.rate }}<small>%</small></div></div></div>
        </div>
        <div class="list-card">
          <el-alert type="info" show-icon :closable="false" class="gov-hint">
            <template #title>暂存可以不填齐，未齐时待治理仍是待治理，已退回仍是已退回。提交审核要求本任务未锁定项都有值。</template>
          </el-alert>
          <div v-if="govGapBoard.length" class="gap-board">
            <div class="gap-label">缺口分布</div>
            <div class="gap-tags">
              <el-tag v-for="g in govGapBoard" :key="g.key" size="small" :type="govGapFilter===g.key?'primary':''" class="gap-tag" @click="govGapFilter=govGapFilter===g.key?'':g.key">{{ g.label }} {{ g.count }} 台</el-tag>
            </div>
          </div>
          <div class="filters">
            <el-input v-model="govQuery.name" placeholder="请输入原始设备名称" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="govQuery.deviceId" placeholder="请输入平台编码" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="govQuery.channelId" placeholder="请输入通道编码" clearable maxlength="200" style="width:180px"/>
            <el-select v-model="govQuery.status" placeholder="请选择治理状态" clearable style="width:150px">
              <el-option label="待治理" value="0"/><el-option label="已暂存" value="1"/><el-option label="待审核" value="2"/><el-option label="已退回" value="3"/><el-option label="已完成" value="4"/>
            </el-select>
            <el-button type="primary" plain @click="govSearch">查询</el-button>
            <el-button type="danger" plain @click="govReset">重置</el-button>
          </div>
          <div class="view-switch scope-switch">
            <template v-if="mode==='three' && taskHasName(activeGovTask)">
              <span class="scope-label">生效目录</span>
              <span class="scope-hint">{{ catalogLabel(activeGovTask.nameCatalog) }}。本任务的规范名称只写这个目录，设备也只从这里绑定。</span>
            </template>
            <template v-else-if="mode==='three'">
              <span class="scope-label">目录体系</span>
              <el-radio-group v-model="govScope" size="small">
                <el-radio-button label="original">原始目录</el-radio-button>
                <el-radio-button label="base">基础目录</el-radio-button>
                <el-radio-button label="business">业务目录</el-radio-button>
              </el-radio-group>
              <span class="scope-hint">按当前目录节点分组。本任务未勾选规范名称，绑定不限定目录。</span>
            </template>
            <span v-else class="scope-label">目录体系：仅原始目录</span>
            <span class="scope-gap"></span>
            <span class="scope-label">视图</span>
            <el-radio-group v-model="govViewMode" size="small">
              <el-radio-button label="device">按设备</el-radio-button>
              <el-radio-button label="cluster">按簇</el-radio-button>
            </el-radio-group>
          </div>
          <div class="tools">
            <el-button @click="openExport">导出填报</el-button>
            <el-button @click="openImport">导入填报</el-button>
            <el-button @click="openOneField">按一个字段写入</el-button>
            <el-button type="primary" :disabled="!govChecked.length" @click="openGovBatch">批量填写（{{ govChecked.length }} 台）</el-button>
          </div>
          <template v-if="govViewMode==='device'">
            <el-table :data="govPagedView" row-key="id" @selection-change="govChecked=$event">
              <el-table-column type="selection" width="42" :selectable="govSelectable" reserve-selection/>
              <el-table-column prop="name" label="原始设备名称" min-width="180" show-overflow-tooltip>
                <template #default="{ row }">{{ row.name }}</template>
              </el-table-column>
              <el-table-column v-if="taskHasName(activeGovTask)" label="设备规范名称" min-width="180" show-overflow-tooltip>
                <template #default="{ row }">{{ catalogName(row, activeGovTask.nameCatalog) || '—' }}</template>
              </el-table-column>
              <el-table-column prop="deviceId" label="平台编码" width="200" show-overflow-tooltip/>
              <el-table-column prop="channelId" label="通道编码" width="200" show-overflow-tooltip/>
              <el-table-column label="字段进度" width="220">
                <template #header>字段进度 <el-tooltip content="已填写字段数 / 本任务治理项总数"><span class="th-tip">?</span></el-tooltip></template>
                <template #default="{ row }"><div class="field-progress"><el-progress :percentage="govPercent(row)" :show-text="false" :stroke-width="6" :color="govPercent(row)>=100?'#52c41a':''" style="width:80px"/><span>{{ govProgress(row).filled }}/{{ govProgress(row).total }} 已填写</span></div></template>
              </el-table-column>
              <el-table-column label="治理状态" width="180">
                <template #default="{ row }"><el-tag :type="govStatusType[row.status]" size="small">{{ govStatusText[row.status] }}</el-tag><el-tag v-if="row.status==='3' && row.rejected" type="danger" size="small" style="margin-left:4px">{{ row.rejected }}项驳回</el-tag></template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }"><el-button v-if="govSelectable(row)" link type="primary" @click="openWb(row)">治理</el-button><el-button v-else link type="primary" @click="openGovDetail(row)">详情</el-button></template>
              </el-table-column>
            </el-table>
            <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="govView.length" :current-page="govPage" :page-size="govPageSize" :page-sizes="[10,20,50,100]" @current-change="govPageChange" @size-change="govSizeChange"/></div>
          </template>
          <template v-else>
            <div class="cluster-hint">按目录分簇查看：每张卡片是一批设备，先看哪个簇待治理最多、缺口最集中，再整批进入治理。点「治理该簇」后，左侧列表只列该簇设备，可连续治理。</div>
            <div class="cluster-grid">
              <div v-for="c in govClusters" :key="c.dir" class="cluster-card">
                <div class="cluster-hd">
                  <div class="cluster-name">{{ c.label }}</div>
                  <div class="cluster-count">{{ c.devices.length }} 台</div>
                </div>
                <div class="cluster-status">
                  <span v-if="c.pending" class="st-pending">待治理 {{ c.pending }}</span>
                  <span v-if="c.saved" class="st-saved">已暂存 {{ c.saved }}</span>
                  <span v-if="c.rejected" class="st-rejected">已退回 {{ c.rejected }}</span>
                </div>
                <div v-if="c.gapList.length" class="cluster-gaps">
                  <el-tag v-for="g in c.gapList" :key="g.key" size="small" type="warning" class="cluster-gap">{{ g.label }} 缺 <b>{{ g.count }}</b> 台</el-tag>
                </div>
                <div class="cluster-actions">
                  <el-button type="primary" size="small" @click="openClusterGovern(c)">治理该簇（{{ c.devices.length }} 台）</el-button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <section v-show="page==='audit'">
        <div class="list-card gov-info">
          <div class="gov-info-hd"><h2>{{ activeGovTask ? activeGovTask.name : '去审核' }}</h2><el-button @click="go('work','治理任务')">返回工作台</el-button></div>
          <div class="gov-meta">
            <span>创建人：<b>{{ activeGovTask ? activeGovTask.creator : '—' }}</b></span>
            <span>审核人组：<b>王审核</b></span>
            <span>治理项数量：<b>{{ activeItemNames.length }}</b></span>
            <span>派单时间：<b>{{ activeGovTask && activeGovTask.dispatched ? '2026-10-26 16:48' : '—' }}</b></span>
          </div>
          <div class="gov-tags"><el-tag v-for="g in activeItemNames" :key="g" size="small">{{ g }}</el-tag></div>
        </div>
        <div class="stats audit-stats">
          <div class="stat"><div><div class="k">总设备数</div><div class="n">{{ audStats.total }}</div></div></div>
          <div class="stat"><div><div class="k">待审核</div><div class="n blue">{{ audStats.pending }}</div></div></div>
          <div class="stat"><div><div class="k">已退回</div><div class="n red">{{ audStats.rejected }}</div></div></div>
          <div class="stat"><div><div class="k">已完成</div><div class="n green">{{ audStats.completed }}</div></div></div>
          <div class="stat"><div><div class="k">完成率</div><div class="n green">{{ audStats.rate }}<small>%</small></div></div></div>
        </div>
        <div class="list-card">
          <el-alert type="info" show-icon :closable="false" class="gov-hint">
            <template #title>本页只关心审核相关状态：待审核 / 已退回 / 已完成（不含待治理、已暂存）。仅待审核可「审核」或勾选批量；已退回/已完成仅「详情」。</template>
          </el-alert>
          <div v-if="audAnomaly.length" class="anomaly-bar">
            <div class="anomaly-label">待核对</div>
            <div class="anomaly-tags">
              <el-tooltip v-for="a in audAnomaly" :key="a.id" :content="'涉及：' + a.devices.join('、')" placement="top">
                <el-tag size="small" type="danger" :effect="audAnomalyFilter===a.id ? 'dark' : 'plain'" class="anomaly-tag" @click="toggleAnomaly(a)">{{ a.text }}</el-tag>
              </el-tooltip>
            </div>
            <span class="anomaly-hint">{{ audAnomalyFilter ? '已只显示涉及设备（' + audView.length + ' 台）' : '点标签可只看涉及设备' }}</span>
            <el-button v-if="audAnomalyFilter" link type="danger" size="small" @click="clearAnomaly">清除筛选</el-button>
          </div>
          <div class="filters">
            <el-input v-model="audQuery.name" placeholder="请输入原始设备名称" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="audQuery.deviceId" placeholder="请输入平台编码" clearable maxlength="200" style="width:180px"/>
            <el-input v-model="audQuery.channelId" placeholder="请输入通道编码" clearable maxlength="200" style="width:180px"/>
            <el-select v-model="audQuery.status" placeholder="请选择状态" clearable style="width:180px">
              <el-option label="待审核" value="2"/><el-option label="已退回" value="3"/><el-option label="已完成" value="4"/>
            </el-select>
            <el-button type="primary" plain @click="audSearch">查询</el-button>
            <el-button type="danger" plain @click="audReset">重置</el-button>
          </div>
          <div class="tools" style="justify-content:flex-start">
            <el-button type="primary" :disabled="!audChecked.length" @click="audBatchPass">批量通过{{ audChecked.length ? '（' + audChecked.length + ' 台）' : '' }}</el-button>
            <el-button type="danger" :disabled="!audChecked.length" @click="openAudReject">批量驳回{{ audChecked.length ? '（' + audChecked.length + ' 台）' : '' }}</el-button>
          </div>
          <el-table :data="audPagedView" row-key="id" @selection-change="audChecked=$event">
            <el-table-column type="selection" width="42" :selectable="audSelectable" reserve-selection/>
            <el-table-column label="原始设备名称" min-width="200">
              <template #default="{ row }">
                <span>{{ row.name }}</span>
                <el-tooltip v-if="audAnomalyOf(row)" :content="audAnomalyTip(row)" placement="top">
                  <el-tag size="small" type="danger" effect="plain" style="margin-left:6px">待核对</el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column v-if="taskHasName(activeGovTask)" label="设备规范名称" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">{{ auditDisplayName(row) }}</template>
            </el-table-column>
            <el-table-column prop="deviceId" label="平台编码" min-width="180" show-overflow-tooltip/>
            <el-table-column prop="channelId" label="通道编码" min-width="180" show-overflow-tooltip/>
            <el-table-column label="治理人" width="90"><template #default>李治理</template></el-table-column>
            <el-table-column label="字段进度" width="200">
              <template #header>字段进度 <el-tooltip content="已通过字段数 / 本任务治理项总数（审核通过后计入，与是否已填写无关）"><span class="th-tip">?</span></el-tooltip></template>
              <template #default="{ row }"><div class="field-progress"><el-progress :percentage="audPercent(row)" :show-text="false" :stroke-width="6" :color="audBarColor(row)" style="width:80px"/><span>{{ audPassedText(row) }} 已通过</span></div></template>
            </el-table-column>
            <el-table-column label="治理状态" width="160">
              <template #default="{ row }"><el-tag :type="govStatusType[row.status]" size="small">{{ govStatusText[row.status] }}</el-tag><el-tag v-if="row.status==='3' && row.rejected" type="danger" size="small" style="margin-left:4px">{{ row.rejected }}项驳回</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template #default="{ row }"><el-button v-if="audSelectable(row)" link type="primary" @click="openAud(row)">审核</el-button><el-button v-else link type="primary" @click="openAudDetail(row)">详情</el-button></template>
            </el-table-column>
          </el-table>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="audView.length" :current-page="audPage" :page-size="audPageSize" :page-sizes="[10,20,50,100]" @current-change="audPageChange" @size-change="audSizeChange"/></div>
        </div>
      </section>

      <section v-show="page==='group'">
        <div class="member-head">
          <div class="member-title">用户组配置</div>
          <p>仅管理员可维护。治理人组是创建任务时的候选池；审核人组可审核任意已派发任务。创建人不自动入组。</p>
        </div>
        <el-tabs v-model="memberTab">
          <el-tab-pane :label="'治理人组 (' + memberGovernCount + ')'" name="govern"/>
          <el-tab-pane :label="'审核人组 (' + memberAuditCount + ')'" name="audit"/>
        </el-tabs>
        <div class="list-card">
          <div class="tools" style="margin-top:0;justify-content:flex-start"><el-button type="primary" @click="openMemberAdd">添加成员</el-button></div>
          <el-table :data="memberView" row-key="userId">
            <el-table-column prop="userId" label="用户ID" width="100"/>
            <el-table-column prop="userName" label="用户名" min-width="140" show-overflow-tooltip/>
            <el-table-column prop="nickName" label="昵称" min-width="140" show-overflow-tooltip/>
            <el-table-column prop="dept" label="部门" min-width="160" show-overflow-tooltip/>
            <el-table-column label="操作" width="100" align="center"><template #default="{ row }"><el-button link type="danger" @click="memberRemove(row)">移除</el-button></template></el-table-column>
          </el-table>
          <div class="pager"><span class="pager-total">共 {{ memberView.length }} 人</span><el-pagination background layout="prev, pager, next, sizes, jumper" :total="memberView.length" :default-page-size="20" :page-sizes="[10,20,50]"/></div>
        </div>
      </section>

      <section v-show="page==='catalog'" class="cat-section">
        <div class="list-card cat-page">
          <p class="hint" style="margin:0 0 12px">目录每天 22:00 按最新数据自动更新。当天改过的区划、单位、标签，到当晚才会进目录。不会删除设备。</p>
          <div class="filters">
            <el-input v-model="catKw" placeholder="请输入业务目录名称" clearable maxlength="200" style="width:210px"/>
            <el-select v-model="catTypeQ" placeholder="请选择生成方式" clearable style="width:320px">
              <el-option v-for="item in catTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-select v-model="catStatusQ" placeholder="请选择状态" clearable style="width:160px">
              <el-option label="启用" :value="1"/><el-option label="停用" :value="0"/>
            </el-select>
            <el-button type="primary" @click="searchCat">查询</el-button>
            <el-button type="danger" plain @click="resetCat">重置</el-button>
          </div>
          <div class="cat-ops"><el-button type="primary" @click="openCatAdd">新增业务目录</el-button></div>
          <div class="cat-table">
            <el-table :data="catView" height="100%">
              <el-table-column prop="name" label="业务目录名称" min-width="180" show-overflow-tooltip/>
              <el-table-column label="生成方式" min-width="220" show-overflow-tooltip><template #default="{ row }">{{ catTypeText(row.type) }}</template></el-table-column>
              <el-table-column prop="tag" label="标签来源" min-width="120" show-overflow-tooltip><template #default="{ row }">{{ row.tag || '-' }}</template></el-table-column>
              <el-table-column label="状态" width="110"><template #default="{ row }"><el-switch :model-value="row.status === 1" inline-prompt active-text="启用" inactive-text="停用" @change="toggleCat(row, $event)"/></template></el-table-column>
              <el-table-column prop="updated" label="最近更新时间" width="170"/>
              <el-table-column prop="creator" label="创建人" width="100" show-overflow-tooltip/>
              <el-table-column prop="created" label="创建时间" width="170"/>
              <el-table-column label="操作" width="220" align="center" fixed="right"><template #default="{ row }">
                <el-button link type="primary" @click="openCatEdit(row)">编辑</el-button>
                <el-button link type="primary" @click="openCatLog(row)">更新记录</el-button>
                <el-button link type="danger" @click="deleteCat(row)">删除</el-button>
              </template></el-table-column>
            </el-table>
          </div>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="catView.length" :default-page-size="20" :page-sizes="[10,20,50]"/></div>
        </div>
      </section>

    </main>
  </div>

  <el-dialog v-model="batchOpen" title="批量修改" width="560px" @closed="batchStep=1">
    <template v-if="batchStep===1">
      <div class="hint" style="margin-bottom:8px">先定范围，再选一个字段。打开弹窗时锁定当时的勾选和筛选，不是当前这一页。不能批量改经纬度。</div>
      <el-radio-group v-model="batchScope">
        <el-radio label="checked" :disabled="!lockedChecked.length">已勾选 {{ lockedChecked.length }} 台</el-radio>
        <el-radio label="filter">当前筛选结果的全部 {{ listTotal }} 台</el-radio>
      </el-radio-group>
      <el-radio-group v-model="batchField" class="dim-list" @change="batchValue=''">
        <el-radio v-if="showName" label="name">规范命名</el-radio>
        <el-radio label="unit">管理单位</el-radio>
        <el-radio label="tag">业务标签</el-radio>
        <el-radio label="type">设备类型</el-radio>
        <el-radio label="vendor">设备厂商</el-radio>
        <el-radio label="install">安装日期</el-radio>
        <el-radio label="warranty">维保到期</el-radio>
        <el-radio label="area">行政区划</el-radio>
      </el-radio-group>
    </template>
    <template v-else>
      <div class="batch-count">修改 {{ batchCount }} 台<span class="hint">{{ batchScope==='checked' ? '已勾选的设备' : '当前筛选的全部，不是这一页' }}</span></div>
      <el-form label-width="100px">
        <el-form-item v-if="batchField==='unit'||batchField==='tag'" label="操作类型">
          <el-radio-group v-model="batchAction"><el-radio-button label="bind">绑定</el-radio-button><el-radio-button label="unbind">解绑</el-radio-button></el-radio-group>
        </el-form-item>
        <template v-if="batchField==='name'">
          <div class="subcard">
            <h4>当前目录：{{ currentScopeTitle }}</h4>
            <template v-if="activeNameRule.source==='catalog'">
              <div>生效模板：{{ activeNameRule.tpl }}</div>
              <div class="hint">来源：当前目录。示例：{{ activeNameRule.preview }}。每台按自己的单位、区划、类型生成，不会写成同一个名字。</div>
            </template>
            <template v-else>
              <div>当前目录没有启用模板，本次用全局默认 {{ activeNameRule.tpl }}，示例 {{ activeNameRule.preview }}。</div>
              <div class="hint">每台生成自己的序号，不会写成同一个名字。</div>
            </template>
          </div>
          <el-checkbox v-model="skipProtected">跳过已经手动改过的名称</el-checkbox>
        </template>
        <el-form-item v-else-if="batchField==='unit' && batchAction==='bind'" label="管理单位">
          <el-select v-model="batchValue" placeholder="请选择叶子单位" style="width:100%"><el-option label="文新派出所" value="文新派出所"/><el-option label="北山派出所" value="北山派出所"/><el-option label="仓前派出所" value="仓前派出所"/></el-select>
          <div class="hint">这批设备改成同一个管理单位。</div>
        </el-form-item>
        <el-alert v-else-if="batchField==='unit'" type="warning" :closable="false" title="只清除管理单位。治理名称保持不变。"/>
        <el-form-item v-else-if="batchField==='tag' && batchAction==='bind'" label="业务标签">
          <el-select v-model="batchValue" multiple placeholder="请选择启用的叶子" style="width:100%"><el-option label="重点区域 / 学校周边" value="学校周边"/><el-option label="重点区域 / 医院周边" value="医院周边"/><el-option label="重点区域 / 重点路口" value="重点路口"/></el-select>
          <div class="hint">在原有标签上追加。同一字典可以多选叶子。</div>
        </el-form-item>
        <el-form-item v-else-if="batchField==='tag'" label="解绑标签">
          <el-select v-model="batchValue" multiple placeholder="只移除勾选的标签" style="width:100%"><el-option label="学校周边" value="学校周边"/><el-option label="医院周边" value="医院周边"/></el-select>
          <div class="hint">只去掉选中的标签，其他标签保留。</div>
        </el-form-item>
        <el-form-item v-else-if="batchField==='type'" label="设备类型">
          <el-select v-model="batchValue" placeholder="请选择设备类型" style="width:100%"><el-option v-for="t in ['枪机','半球','球机','鹰眼','全景','梯半球','针孔']" :key="t" :label="t" :value="t"/></el-select>
          <div class="hint">这批设备改成同一种类型。</div>
        </el-form-item>
        <el-form-item v-else-if="batchField==='vendor'" label="设备厂商">
          <el-input v-model="batchValue" maxlength="50" show-word-limit placeholder="如：海康威视"/>
          <div class="hint">最多 50 字。这批写成同一个厂商，不计入已治理。</div>
        </el-form-item>
        <el-form-item v-else-if="batchField==='install'" label="安装日期">
          <el-date-picker v-model="batchValue" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width:100%"/>
          <div class="hint">写成同一个日期。不计入已治理。</div>
        </el-form-item>
        <el-form-item v-else-if="batchField==='warranty'" label="维保到期">
          <el-date-picker v-model="batchValue" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width:100%"/>
          <div class="hint">写成同一个日期。不计入已治理。</div>
        </el-form-item>
        <el-form-item v-else label="行政区划">
          <div class="field-line">
            <el-input class="root-lock" model-value="浙江省" disabled/>
            <el-cascader v-model="batchValue" class="area-cascader" placeholder="从市开始选" :options="areaOptions" :props="areaProps" clearable separator=" / "/>
          </div>
          <div class="hint">省已锁定。这批设备挂到同一个节点，从市开始，可以停在中间层级。</div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <template v-if="batchStep===1">
        <el-button @click="batchOpen=false">取消</el-button>
        <el-button type="primary" :disabled="!batchField" @click="previewBatch">下一步</el-button>
      </template>
      <template v-else>
        <el-button @click="batchStep=1">返回</el-button>
        <el-button type="primary" @click="runBatch">{{ batchField==='name' ? '确认命名 ' + batchCount + ' 台' : (batchAction==='unbind' && (batchField==='unit'||batchField==='tag') ? '确认解绑 ' + batchCount + ' 台' : '确认修改 ' + batchCount + ' 台') }}</el-button>
      </template>
    </template>
  </el-dialog>

  <el-dialog v-model="colOpen" title="列表配置" width="720px">
    <el-row :gutter="16">
      <el-col :span="12">
        <b>查询条件</b>
        <div class="hint">和列表列分开记。取消某项时清掉已填条件。</div>
        <el-checkbox-group v-model="filterKeys" class="check-col">
          <el-checkbox label="name">设备名称</el-checkbox>
          <el-checkbox label="online">在线状态</el-checkbox>
          <el-checkbox label="gov">治理状态</el-checkbox>
          <el-checkbox label="coord">坐标</el-checkbox>
          <el-checkbox label="type">设备类型</el-checkbox>
          <el-checkbox label="vendor">设备厂商</el-checkbox>
          <el-checkbox label="unit">管理单位</el-checkbox>
          <el-checkbox label="area">行政区划</el-checkbox>
          <el-checkbox label="tag">业务标签</el-checkbox>
          <el-checkbox label="install">安装日期</el-checkbox>
          <el-checkbox label="warranty">维保到期</el-checkbox>
        </el-checkbox-group>
        <div class="hint">显示已删除固定在筛选栏，不在这里配置。</div>
      </el-col>
      <el-col :span="12">
        <b>列表列</b>
        <div class="hint">设备名称和操作固定，不能取消。</div>
        <el-checkbox checked disabled>设备名称</el-checkbox>
        <el-checkbox-group v-model="colKeys" class="check-col">
          <el-checkbox label="online">在线状态</el-checkbox>
          <el-checkbox label="gov">治理状态</el-checkbox>
          <el-checkbox label="coord">坐标</el-checkbox>
          <el-checkbox label="type">设备类型</el-checkbox>
          <el-checkbox label="vendor">设备厂商</el-checkbox>
          <el-checkbox label="unit">管理单位</el-checkbox>
          <el-checkbox label="area">行政区划</el-checkbox>
          <el-checkbox label="tag">标签</el-checkbox>
          <el-checkbox label="install">安装日期</el-checkbox>
          <el-checkbox label="warranty">维保到期</el-checkbox>
        </el-checkbox-group>
        <el-checkbox checked disabled>操作</el-checkbox>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="resetListConfig">恢复默认</el-button>
      <el-button @click="colOpen=false">取消</el-button>
      <el-button type="primary" @click="colOpen=false; ElMessage.success('已按当前用户保存')">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="nameOpen" title="命名规则" width="860px">
    <div class="filters">
      <span class="hint">这里管理全部目录的模板，不随左侧当前目录变化。给设备命名用列表上的批量修改，选规范命名。</span>
      <span class="grow"></span>
      <el-button type="primary" @click="openRule('create')">新增</el-button>
    </div>
    <div class="subcard" style="margin-top:12px">
      <h4>全局默认</h4>
      <div>模板：{{ globalNameRule.tpl }}　　预览：{{ globalNameRule.preview }}</div>
      <div class="hint">目录没有启用模板，或模板已停用时，批量命名用这一条。不能删除，也不能停用。</div>
    </div>
    <el-table :data="catalogRules" max-height="320" empty-text="还没有目录模板">
      <el-table-column prop="scopeName" label="生效目录" width="160"/>
      <el-table-column prop="tpl" label="命名模板" min-width="220" show-overflow-tooltip/>
      <el-table-column prop="preview" label="预览名称" min-width="180" show-overflow-tooltip/>
      <el-table-column label="启用" width="80"><template #default="{ row }"><el-switch v-model="row.on"/></template></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="openRule('edit', row)">编辑</el-button>
          <el-button link type="danger" @click="deleteRule(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer><el-button @click="nameOpen=false">关闭</el-button></template>
  </el-dialog>

  <el-dialog v-model="ruleEditOpen" :title="ruleDialogTitle" width="640px" append-to-body>
    <el-form label-width="100px">
      <el-form-item label="生效目录" required>
        <el-select v-model="ruleForm.scope" :disabled="ruleMode==='edit'" placeholder="请选择生效目录" style="width:100%">
          <el-option v-for="o in ruleScopeOptions" :key="o.id" :label="o.bound ? o.name + '（已绑定）' : o.name" :value="o.id" :disabled="o.bound"/>
        </el-select>
        <div class="hint">{{ ruleMode==='edit' ? '编辑时不能改生效目录。' : '已经绑定过模板的目录不能再选。' }}</div>
      </el-form-item>
      <el-form-item label="命名模板" required>
        <div class="token-row">
          <el-tag v-for="t in nameTokens" :key="t" class="token" @click="insertToken(t)">{{ t }}</el-tag>
        </div>
        <el-input v-model="ruleForm.tpl" type="textarea" :rows="3" placeholder="点上面的占位符插入，或直接填写"/>
      </el-form-item>
      <el-form-item label="预览名称"><el-input :model-value="rulePreview" disabled/></el-form-item>
      <el-form-item label="启用"><el-switch v-model="ruleForm.on"/></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="ruleEditOpen=false">取消</el-button>
      <el-button type="primary" @click="saveRule">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="syncOpen" title="数据同步配置" width="520px">
    <el-form label-width="90px">
      <el-form-item label="同步类型"><el-radio-group model-value="inc"><el-radio label="inc">增量</el-radio><el-radio label="full">全量</el-radio></el-radio-group></el-form-item>
      <el-form-item label="同步范围"><el-select model-value="current" style="width:100%"><el-option label="当前目录及下级" value="current"/></el-select></el-form-item>
      <el-form-item label="删除处理"><el-checkbox>源表已删除的通道标记删除</el-checkbox></el-form-item>
    </el-form>
    <template #footer><el-button @click="syncOpen=false">取消</el-button><el-button type="primary" @click="syncOpen=false; ElMessage.success('已开始同步')">开始同步</el-button></template>
  </el-dialog>

  <el-dialog v-model="syncLogOpen" title="同步日志" width="720px">
    <el-table :data="[{time:'2026-10-27 18:20:11',type:'增量',who:'罗港',result:'成功 1286 / 失败 0'}]">
      <el-table-column prop="time" label="时间" width="180"/>
      <el-table-column prop="type" label="类型" width="80"/>
      <el-table-column prop="who" label="操作人" width="100"/>
      <el-table-column prop="result" label="结果"/>
    </el-table>
  </el-dialog>

  <el-dialog v-model="nodeOpen" :title="orgDialogTitle" width="480px">
    <el-form v-if="page==='unit'" label-width="90px">
      <el-form-item label="上级"><el-input :model-value="orgFormParent" disabled/></el-form-item>
      <el-form-item label="名称" required><el-input v-model="orgForm.name" maxlength="50" placeholder="请输入单位名称"/></el-form-item>
    </el-form>
    <el-form v-else-if="orgMode==='dict'" label-width="90px">
      <el-form-item label="字典名称" required><el-input v-model="orgForm.name" maxlength="50" placeholder="最多 50 字"/></el-form-item>
      <el-form-item label="字典编码" required><el-input v-model="orgForm.code" maxlength="2" placeholder="2 位大写字母" :disabled="dictEditing"/></el-form-item>
      <el-form-item label="最大层级">
        <el-select v-model="orgForm.maxLevel" :disabled="dictEditing && orgNode.children && orgNode.children.length" style="width:100%">
          <el-option v-for="n in [2,3,4,5]" :key="n" :label="n + ' 级（含字典自身）'" :value="n"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form v-else label-width="90px">
      <el-form-item label="所属字典"><el-input :model-value="orgDict ? (orgDict.label + ' ' + orgDict.code) : ''" disabled/></el-form-item>
      <el-form-item label="父标签"><el-input :model-value="orgFormParent" disabled/></el-form-item>
      <el-form-item label="名称" required><el-input v-model="orgForm.name" maxlength="50" placeholder="请输入标签名称"/></el-form-item>
      <el-form-item v-if="orgMode==='add'" label="当前层级"><el-input :model-value="'L' + ((orgNode.level || 1) + 1)" disabled/></el-form-item>
      <el-form-item v-if="orgMode==='add'" label="标签编码"><el-input model-value="保存后由系统生成" disabled/></el-form-item>
    </el-form>
    <div v-if="page==='unit'" class="hint">与老系统一致：只有单位名称和上级单位，没有排序号。第 3 级不能再作为上级。只绑定启用的叶子。</div>
    <div v-else-if="orgMode==='dict'" class="hint">编码保存后不可改。已有子标签时不能改最大层级。已预置 GA、CG、JT、SL、YJ、MS、ZB，不能删除。</div>
    <div v-else class="hint">未到该字典最大层级的是分类，到了最大层级才是叶子。只绑定启用的叶子。</div>
    <template #footer><el-button @click="nodeOpen=false">取消</el-button><el-button type="primary" @click="nodeOpen=false; ElMessage.success('已保存')">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="areaCreateOpen" title="新增子节点" width="480px">
    <el-form label-width="90px">
      <el-form-item label="父节点"><el-input model-value="西湖区" disabled/></el-form-item>
      <el-form-item label="名称"><el-input placeholder="请输入名称"/></el-form-item>
      <el-form-item label="编码"><el-input placeholder="请输入编码"/></el-form-item>
    </el-form>
    <template #footer><el-button @click="areaCreateOpen=false">取消</el-button><el-button type="primary" @click="areaCreateOpen=false; ElMessage.success('已新增')">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="dispatchOpen" title="派单预演" width="560px" :close-on-click-modal="false">
    <div v-if="dispatchTask" class="dispatch-check">
      <div class="check-row"><span class="check-k">任务名称</span><span class="check-v">{{ dispatchTask.name }}</span></div>
      <div class="check-row"><span class="check-k">治理人</span><span class="check-v">{{ dispatchTask.who }}</span></div>
      <div class="check-row"><span class="check-k">治理项</span><span class="check-v">{{ dispatchTask.items }}</span></div>
      <div class="check-row"><span class="check-k">绑定设备</span><span class="check-v">{{ dispatchTask.n }} 台</span></div>
      <div class="check-row" v-if="nameRuleOf(dispatchTask)"><span class="check-k">生效目录</span><span class="check-v">{{ nameRuleOf(dispatchTask).label }}，{{ dispatchTask.n }} 台</span></div>
      <div class="check-row" v-if="nameRuleOf(dispatchTask)"><span class="check-k">命名来源</span><span class="check-v">{{ nameRuleOf(dispatchTask).source==='catalog' ? '目录模板' : '全局默认' }}</span></div>
      <div class="check-row" v-if="nameRuleOf(dispatchTask)"><span class="check-k">命名模板</span><span class="check-v">{{ nameRuleOf(dispatchTask).tpl }}</span></div>
      <div class="check-row" v-if="nameRuleOf(dispatchTask)"><span class="check-k">名称示例</span><span class="check-v">{{ nameRuleOf(dispatchTask).preview }}</span></div>
      <template v-if="prefillCoverLines(dispatchTask).length">
        <div v-for="line in prefillCoverLines(dispatchTask)" :key="line.label" class="check-row"><span class="check-k">{{ line.label }}</span><span class="check-v">{{ line.text }}，{{ line.n }} 台</span></div>
      </template>
      <div v-else class="check-row"><span class="check-k">预填值</span><span class="check-v">未预填</span></div>
      <div v-if="dispatchTask.prefillBy" class="check-row"><span class="check-k">预填记录</span><span class="check-v">预填 · {{ dispatchTask.prefillBy }} · {{ dispatchTask.prefillAt }}</span></div>
      <el-alert v-if="dispatchDeleted(dispatchTask).length" type="error" show-icon :closable="false" style="margin-top:12px" :title="dispatchDeletedText(dispatchTask)"/>
      <el-alert v-else type="warning" show-icon :closable="false" style="margin-top:12px" title="派单后不可撤回，任务进入已派发状态，设备生成待治理明细。"/>
    </div>
    <template #footer><el-button @click="dispatchOpen=false">取消</el-button><el-button type="primary" :disabled="dispatchDeleted(dispatchTask).length > 0" @click="dispatchOpen=false; ElMessage.success('派单成功')">确认派单</el-button></template>
  </el-dialog>

  <el-dialog v-model="taskCreateOpen" title="创建治理任务" width="720px" :close-on-click-modal="false">
    <el-form label-position="top">
      <el-form-item label="任务名称"><el-input v-model="taskCreateName" maxlength="50" show-word-limit placeholder="请输入任务名称"/></el-form-item>
      <el-form-item label="治理人"><el-select v-model="taskCreateWho" multiple style="width:100%"><el-option label="李治理" value="李治理"/><el-option label="王审核" value="王审核"/></el-select></el-form-item>
      <el-form-item label="治理项">
        <el-checkbox-group v-model="taskItems">
          <el-checkbox v-for="g in offerItems" :key="g" :label="g">{{ g }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="taskItems.indexOf('设备规范名称')>=0" label="生效目录">
        <el-select v-model="taskCreateCatalog" placeholder="请选择规范名称生效的目录" style="width:100%">
          <el-option v-for="item in nameCatalogOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <div class="prefill-desc">选定后，绑定设备只能从该目录圈定。已绑定设备后不能再改。</div>
      </el-form-item>
    </el-form>
    <template #footer><el-button @click="taskCreateOpen=false">取消</el-button><el-button type="primary" @click="saveTaskCreate">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="taskEditOpen" title="编辑治理任务" width="720px" :close-on-click-modal="false">
    <el-form label-position="top">
      <el-form-item label="任务名称"><el-input v-model="taskEditName" maxlength="50" show-word-limit placeholder="请输入任务名称"/></el-form-item>
      <el-form-item label="治理人"><el-select v-model="taskEditWho" multiple style="width:100%"><el-option label="李治理" value="李治理"/><el-option label="王审核" value="王审核"/></el-select></el-form-item>
      <el-form-item label="治理项">
        <el-checkbox-group v-model="taskEditItems">
          <el-checkbox v-for="g in offerItems" :key="g" :label="g" :disabled="!!(editingTask && editingTask.n>0 && g==='设备规范名称')">{{ g }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="taskEditItems.indexOf('设备规范名称')>=0" label="生效目录">
        <el-select v-model="taskEditCatalog" :disabled="!!(editingTask && editingTask.n>0)" placeholder="请选择规范名称生效的目录" style="width:100%">
          <el-option v-for="item in nameCatalogOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <div class="prefill-desc">{{ editingTask && editingTask.n>0 ? '已有绑定设备，规范名称和生效目录已锁定。要更换请先移出设备。' : '选定后，绑定设备只能从该目录圈定。' }}</div>
      </el-form-item>
    </el-form>
    <template #footer><el-button @click="taskEditOpen=false">取消</el-button><el-button type="primary" @click="saveTaskEdit">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="memberOpen" :title="memberTab==='govern' ? '添加成员至治理人组' : '添加成员至审核人组'" width="900px" :close-on-click-modal="false">
    <p class="add-tip">支持按用户名、昵称、用户ID分别查询；已在组内的用户不可重复添加。</p>
    <div class="filters" style="margin-bottom:12px">
      <el-input v-model="memberKw.userId" placeholder="请输入用户ID" clearable maxlength="200" style="width:140px" @keyup.enter="memberSearch"/>
      <el-input v-model="memberKw.userName" placeholder="请输入用户名" clearable maxlength="200" style="width:160px" @keyup.enter="memberSearch"/>
      <el-input v-model="memberKw.nickName" placeholder="请输入昵称" clearable maxlength="200" style="width:160px" @keyup.enter="memberSearch"/>
      <el-button type="primary" plain @click="memberSearch">查询</el-button>
      <el-button type="danger" plain @click="memberReset">重置</el-button>
    </div>
    <el-table :data="memberUserView" row-key="userId" height="360" @selection-change="memberPick=$event">
      <el-table-column type="selection" width="42" :selectable="memberSelectable" reserve-selection/>
      <el-table-column prop="userId" label="用户ID" width="90"/>
      <el-table-column prop="userName" label="用户名" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="nickName" label="昵称" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="dept" label="部门" min-width="140" show-overflow-tooltip/>
      <el-table-column label="状态" width="100" align="center"><template #default="{ row }"><el-tag v-if="row.inGroup" type="info" size="small">已在组内</el-tag><el-tag v-else type="success" size="small">可选</el-tag></template></el-table-column>
    </el-table>
    <template #footer>
      <div class="modal-footer"><span>已选 {{ memberPick.length }} 人</span><span><el-button @click="memberOpen=false">取消</el-button><el-button type="primary" @click="memberAdd">确定</el-button></span></div>
    </template>
  </el-dialog>

  <el-dialog v-model="catOpen" :title="catEditing ? '编辑业务目录' : '新增业务目录'" width="1000px" top="4vh" :close-on-click-modal="false">
    <div class="bd-body">
      <div class="bd-config" :style="{ width: catForm.status === 1 ? '60%' : '100%' }">
        <h3>配置区</h3>
        <el-form label-position="top">
          <el-form-item label="目录名称" required>
            <el-input v-model="catForm.name" maxlength="50" placeholder="请输入目录名称" clearable/>
          </el-form-item>
          <el-form-item label="生成方式" required>
            <div class="bd-methods">
              <div class="bd-method" :class="{ on: catForm.generateType === 'area', disabled: catEditing }" @click="pickCatType('area')"><b>只按区域</b><span>杭州市</span><span class="sub">└ 西湖区</span><span class="sub2">└ 西溪街道</span></div>
              <div class="bd-method" :class="{ on: catForm.generateType === 'unit', disabled: catEditing }" @click="pickCatType('unit')"><b>只按管理单位</b><span>市公安局</span><span class="sub">└ 西湖分局</span><span class="sub2">└ 文新派出所</span></div>
              <div class="bd-method" :class="{ on: catForm.generateType === 'tag', disabled: catEditing }" @click="pickCatType('tag')"><b>只按业务分类</b><span>重点区域</span><span class="sub">└ 学校周边</span><span class="sub2">└ 医院周边</span></div>
              <div class="bd-method" :class="{ on: catForm.generateType === 'areaTag', disabled: catEditing }" @click="pickCatType('areaTag')"><b>先区域后分类</b><span>西溪街道</span><span class="sub">└ 学校周边</span><span class="sub2">└ 医院周边</span></div>
              <div class="bd-method" :class="{ on: catForm.generateType === 'unitTag', disabled: catEditing }" @click="pickCatType('unitTag')"><b>先管理单位后分类</b><span>文新派出所</span><span class="sub">└ 学校周边</span><span class="sub2">└ 医院周边</span></div>
            </div>
          </el-form-item>
          <template v-if="catForm.generateType === 'area'">
            <el-form-item label="区域源头" required><el-cascader v-model="catForm.regionSource" :options="catRegionOptions" :props="catRegionProps" :disabled="catEditing" clearable placeholder="请选择区域源头" style="width:100%" @change="onCatRegionChange"/></el-form-item>
            <el-form-item label="区域展开到" required class="bd-half"><el-select v-model="catForm.regionLevel" :disabled="catEditing" clearable placeholder="请选择层级" style="width:100%" @change="clearCatPreview"><el-option v-for="opt in catRegionLevels" :key="opt.value" :label="opt.label" :value="opt.value"/></el-select><div class="bd-tip">展开层级不能高于区域源头</div></el-form-item>
          </template>
          <template v-if="catForm.generateType === 'unit'">
            <el-form-item label="管理单位源头" required><el-cascader v-model="catForm.unitSource" :options="catUnitOptions" :props="catRegionProps" :disabled="catEditing" clearable placeholder="请选择管理单位源头" style="width:100%" @change="onCatUnitChange"/></el-form-item>
            <el-form-item label="管理单位展开到" required class="bd-half"><el-select v-model="catForm.unitLevel" :disabled="catEditing" clearable placeholder="请选择层级" style="width:100%" @change="clearCatPreview"><el-option v-for="opt in catUnitLevels" :key="opt.value" :label="opt.label" :value="opt.value"/></el-select><div class="bd-tip">展开层级不能高于单位源头</div></el-form-item>
          </template>
          <template v-if="catForm.generateType === 'tag'">
            <div class="bd-row">
              <el-form-item label="业务域 / 标签来源"><el-select v-model="catForm.tagSourceId" :disabled="catEditing" clearable placeholder="不填则使用全部标签域" style="width:100%" @change="clearCatPreview"><el-option v-for="item in catTagSources" :key="item.id" :label="item.name" :value="item.id"/></el-select></el-form-item>
              <el-form-item label="业务展开到"><el-select v-model="catForm.tagLevel" :disabled="catEditing" clearable placeholder="不填则展到叶子" style="width:100%" @change="clearCatPreview"><el-option label="L1" value="L1"/><el-option label="L2" value="L2"/><el-option label="L3" value="L3"/></el-select></el-form-item>
            </div>
            <div class="bd-tip">都不填时按全部标签域展到叶子。同一字典的多个叶子各挂一次，同一台设备可以出现在多个节点下。</div>
          </template>
          <template v-if="catForm.generateType === 'areaTag'">
            <el-form-item label="区域源头" required><el-cascader v-model="catForm.regionSource" :options="catRegionOptions" :props="catRegionProps" :disabled="catEditing" clearable placeholder="请选择区域源头" style="width:100%" @change="onCatRegionChange"/></el-form-item>
            <el-form-item label="区域展开到" required class="bd-half"><el-select v-model="catForm.regionLevel" :disabled="catEditing" clearable placeholder="请选择层级" style="width:100%" @change="clearCatPreview"><el-option v-for="opt in catRegionLevels" :key="opt.value" :label="opt.label" :value="opt.value"/></el-select><div class="bd-tip">展开层级不能高于区域源头</div></el-form-item>
            <el-form-item label="业务域 / 标签来源" required><el-select v-model="catForm.tagSourceId" :disabled="catEditing" clearable placeholder="请选择一个标签字典" style="width:100%" @change="clearCatPreview"><el-option v-for="item in catTagSources" :key="item.id" :label="item.name" :value="item.id"/></el-select><div class="bd-tip">该字典的每个叶子在区域末端各挂一层，不再选择业务展开层级。</div></el-form-item>
          </template>
          <template v-if="catForm.generateType === 'unitTag'">
            <el-form-item label="管理单位源头" required><el-cascader v-model="catForm.unitSource" :options="catUnitOptions" :props="catRegionProps" :disabled="catEditing" clearable placeholder="请选择管理单位源头" style="width:100%" @change="onCatUnitChange"/></el-form-item>
            <el-form-item label="管理单位展开到" required class="bd-half"><el-select v-model="catForm.unitLevel" :disabled="catEditing" clearable placeholder="请选择层级" style="width:100%" @change="clearCatPreview"><el-option v-for="opt in catUnitLevels" :key="opt.value" :label="opt.label" :value="opt.value"/></el-select><div class="bd-tip">展开层级不能高于单位源头</div></el-form-item>
            <el-form-item label="业务域 / 标签来源" required><el-select v-model="catForm.tagSourceId" :disabled="catEditing" clearable placeholder="请选择一个标签字典" style="width:100%" @change="clearCatPreview"><el-option v-for="item in catTagSources" :key="item.id" :label="item.name" :value="item.id"/></el-select><div class="bd-tip">该字典的每个叶子在单位末端各挂一层，不再选择业务展开层级。</div></el-form-item>
          </template>
        </el-form>
      </div>
      <div class="bd-preview" v-show="catForm.status === 1">
        <h3>预览区</h3>
        <div class="bd-preview-card">
          <div class="bd-preview-hd">目录示例</div>
          <div class="bd-preview-body">
            <div v-if="!catPreviewed" class="bd-empty">请先刷新预览</div>
            <div v-else-if="!catPreviewNodes.length" class="bd-empty">暂无数据</div>
            <el-tree v-else :data="catPreviewNodes" default-expand-all/>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="catOpen=false">取消</el-button>
      <el-button v-if="!catEditing" @click="refreshCatPreview">刷新预览</el-button>
      <el-button type="primary" :disabled="!catEditing && !catPreviewed" @click="submitCat">{{ catEditing ? '保存' : '生成并保存' }}</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="naOpen" title="标记不适用" width="520px">
    <el-form label-width="80px">
      <el-form-item label="原因"><el-select v-model="naReason" style="width:100%"><el-option v-for="r in ['车载或移动点位','设备长期离线','待确认','暂不适用','其他']" :key="r" :label="r" :value="r"/></el-select></el-form-item>
      <el-form-item v-if="naReason==='其他'" label="说明"><el-input maxlength="50" placeholder="最多 50 字"/></el-form-item>
      <el-form-item label="补充"><el-input type="textarea" maxlength="200" placeholder="可选"/></el-form-item>
    </el-form>
    <template #footer><el-button @click="naOpen=false">取消</el-button><el-button type="primary" @click="naOpen=false; ElMessage.success('已标不适用。经度、纬度仍不具备')">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="aiOpen" :title="aiMode==='start'?'发起标注':aiMode==='view'?'查看标注':'确认标注'" width="960px">
    <template v-if="aiRow">
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item label="设备名称">{{ aiRow.name }}</el-descriptions-item>
        <el-descriptions-item label="设备编码">{{ aiRow.code }}</el-descriptions-item>
        <el-descriptions-item v-if="aiMode!=='start'" label="所属组织">{{ aiRow.org }}</el-descriptions-item>
        <el-descriptions-item v-if="aiMode!=='start'" label="安装位置">{{ aiRow.place }}</el-descriptions-item>
        <el-descriptions-item v-if="aiMode!=='start'" label="最后标注时间">{{ aiRow.time }}</el-descriptions-item>
        <el-descriptions-item v-if="aiMode==='view'" label="标注状态">已确认</el-descriptions-item>
      </el-descriptions>
      <div v-if="aiMode==='start'" class="hint" style="margin-top:12px">请确保设备名称、安装位置、所属组织信息完整，否则可能影响识别。</div>
      <template v-else>
        <div class="ai-confirm">
          <div class="thumb">暂无截图</div>
          <div class="ai-tag-pane">
            <el-input v-model="aiTagKw" placeholder="搜索标签" clearable @input="filterAiTree"/>
            <el-tree v-if="aiTagNodes.length" :key="aiRow.code + aiMode" ref="aiTagTreeRef" class="ai-tag-tree" :data="aiTagNodes" node-key="id" show-checkbox check-strictly :default-expanded-keys="aiTagExpanded" :default-checked-keys="aiTagChecked" :filter-node-method="aiTagFilter"/>
          </div>
        </div>
        <div class="hint">{{ aiMode==='view' ? '已确认标签，不可修改。' : '建议和确认用的就是业务标签字典，不另建一套。默认收起，仅展开含建议的分支。仅启用的叶子可选。' }}</div>
      </template>
    </template>
    <template #footer>
      <el-button @click="aiOpen=false">{{ aiMode==='view' ? '关闭' : '取消' }}</el-button>
      <el-button v-if="aiMode!=='view'" type="primary" @click="submitAi">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="oneOpen" title="按一个字段写入" width="640px" :close-on-click-modal="false">
    <template v-if="oneStep==='confirm' && onePlan && taskNameRule">
      <div class="name-plan">{{ taskNameRule.hint }}</div>
      <div class="name-plan">将生成 {{ onePlan.generate.length }} 台，跳过已有 {{ onePlan.skipHas.length }} 台，跳过已锁定 {{ onePlan.skipLock.length }} 台，跳过手改 {{ onePlan.skipManual.length }} 台。</div>
      <div class="hint">每台按自己的区划、单位和标签生成，不会写成同一个名字。写入后设备状态不变。</div>
    </template>
    <template v-else>
      <div class="hint" style="margin-bottom:8px">范围是已勾选的可填写设备；没勾选时，用当前筛选里待治理、已暂存、已退回的设备。已锁定的跳过。写完不进入待审核。</div>
      <div v-if="activeItemNames.indexOf('经纬度')>=0" class="hint" style="margin-bottom:8px">经纬度不在这个入口。请到连续治理逐台选点，需要接近的坐标时点「沿用上一台」。</div>
      <el-form label-width="110px">
        <el-form-item label="字段">
          <el-select v-model="oneField" style="width:100%">
            <el-option v-for="item in oneWriteOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="oneField==='standardName'" label="命名规则">
          <div v-if="taskNameRule" class="name-plan">{{ taskNameRule.hint }}按这个规则逐台生成，已有名称不覆盖。</div>
          <span v-else class="hint">当前任务没有规范名称。</span>
        </el-form-item>
        <el-form-item v-else label="新值"><el-input v-model="oneValue" maxlength="200" placeholder="写入所选设备的这一项"/></el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button v-if="oneStep==='confirm'" @click="oneStep='form'">返回</el-button>
      <el-button v-else @click="oneOpen=false">取消</el-button>
      <el-button type="primary" @click="submitOneField">{{ oneStep==='confirm' ? '确认生成' : '执行' }}</el-button>
    </template>
  </el-dialog>

  <el-drawer v-model="wbOpen" class="sheet-drawer" direction="btt" size="90%" :with-header="false" :close-on-click-modal="false">
    <div class="wb">
      <div class="wb-header"><div class="wb-title"><strong>连续治理</strong><span class="wb-sub">{{ activeGovTask ? activeGovTask.name : '' }}<template v-if="wbScopeLabel"> · {{ wbScopeLabel }}（{{ wbView.length }} 台）</template></span><el-button v-if="wbScopeLabel" link type="primary" size="small" @click="clearWbScope">查看全部设备</el-button></div><el-button link @click="wbOpen=false">关闭</el-button></div>
      <div class="wb-body">
        <aside class="wb-list">
          <div class="wb-list-toolbar">
            <el-input v-model="wbQuery.name" placeholder="请输入原始设备名称" clearable maxlength="200" size="small" style="width:170px"/>
            <el-input v-model="wbQuery.channelId" placeholder="请输入通道编码" clearable maxlength="200" size="small" style="width:150px"/>
            <el-select v-model="wbQuery.status" placeholder="请选择状态" clearable size="small" style="width:110px">
              <el-option label="待治理" value="0"/><el-option label="已暂存" value="1"/><el-option label="已退回" value="3"/>
            </el-select>
            <el-button type="primary" plain size="small" @click="wbSearch">查询</el-button>
            <el-button type="danger" plain size="small" @click="wbReset">重置</el-button>
          </div>
          <el-table :data="wbPagedView" size="small" row-key="id" :row-class-name="wbRowClass" @row-click="wbSelect">
            <el-table-column prop="name" label="原始设备名称" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">{{ deviceDisplayName(row) }}</template>
            </el-table-column>
            <el-table-column prop="channelId" label="通道编码" width="120" show-overflow-tooltip/>
            <el-table-column width="110">
              <template #header>字段进度 <el-tooltip content="已填写字段数 / 本任务治理项总数"><span class="th-tip">?</span></el-tooltip></template>
              <template #default="{ row }">{{ govProgress(row).filled }}/{{ govProgress(row).total }} 已填写</template>
            </el-table-column>
            <el-table-column label="设备状态" width="90"><template #default="{ row }"><el-tag :type="govStatusType[row.status]" size="small">{{ govStatusText[row.status] }}</el-tag></template></el-table-column>
          </el-table>
          <div class="wb-pager"><el-pagination small background layout="total, prev, pager, next" :total="wbView.length" :current-page="wbPage" :page-size="wbPageSize" @current-change="wbPageChange"/></div>
        </aside>
        <section v-if="wbCurrent" class="wb-form">
          <div class="wb-form-scroll">
            <el-descriptions :column="3" size="small" border style="margin-bottom:12px">
              <el-descriptions-item label="原始名称">{{ wbCurrent.name }}</el-descriptions-item>
              <el-descriptions-item label="平台编码">{{ wbCurrent.deviceId }}</el-descriptions-item>
              <el-descriptions-item label="通道编码">{{ wbCurrent.channelId }}</el-descriptions-item>
            </el-descriptions>
            <el-alert v-if="wbCurrent.status==='3' && wbCurrent.comments" type="error" show-icon :closable="false" style="margin-bottom:12px" :title="'审核驳回理由：' + wbCurrent.comments"/>
            <el-alert v-if="wbTip.text" :type="wbTip.type" show-icon :closable="false" style="margin-bottom:12px" :title="wbTip.text"/>
            <div class="gov-form-grid">
              <div v-for="field in wbFields" :key="field.key" class="gov-field" :class="{ span2: field.span }">
                <div class="gov-label"><span class="req">*</span>{{ field.label }}
                  <el-tag v-if="wbCurrent.locked.indexOf(field.key)>=0" type="success" size="small">已通过</el-tag>
                  <el-tag v-else-if="wbCurrent.rejectedKeys.indexOf(field.key)>=0" type="danger" size="small">已驳回</el-tag>
                </div>
                <template v-if="wbCurrent.locked.indexOf(field.key)>=0">
                  <el-input :model-value="wbCurrent.values[field.key]" disabled/>
                </template>
                <template v-else-if="field.kind==='lng'">
                  <div class="lng-row"><el-input v-model="wbForm.lng" placeholder="经度" @input="wbMark"/><el-input v-model="wbForm.lat" placeholder="纬度" @input="wbMark"/></div>
                  <div class="lng-tools">
                    <el-tooltip :disabled="wbCanReuse" content="上一台还没有已保存的坐标" placement="top">
                      <span class="op-tip"><el-button :disabled="!wbCanReuse" @click="reuseWbPrev">沿用上一台</el-button></span>
                    </el-tooltip>
                  </div>
                  <div class="map gov-map"><div class="pin" :style="wbPin"></div></div>
                  <div class="hint">{{ wbCoordHint }}</div>
                </template>
                <el-select v-else-if="field.kind==='select'" v-model="wbForm[field.key]" style="width:100%" @change="wbMark">
                  <el-option label="枪机" value="枪机"/><el-option label="半球" value="半球"/><el-option label="球机" value="球机"/>
                </el-select>
                <el-date-picker v-else-if="field.kind==='date'" v-model="wbForm[field.key]" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width:100%" @change="wbMark"/>
                <template v-else-if="field.key==='standardName'">
                  <el-input v-model="wbForm.standardName" maxlength="50" show-word-limit placeholder="请输入，或按生效目录的命名规则生成" @input="wbNameInput"/>
                  <div v-if="taskNameRule" class="name-quick"><span>{{ taskNameRule.hint }}</span><el-button link type="primary" size="small" @click="applyTaskName">按规则生成</el-button></div>
                </template>
                <el-input v-else v-model="wbForm[field.key]" @input="wbMark"/>
                <div class="orig-ref">当前值：{{ currentOf(wbCurrent, field.key) }}</div>
                <div v-if="wbCurrent.suggestions && wbCurrent.suggestions[field.key] && wbCurrent.locked.indexOf(field.key)<0" class="suggest-ref">
                  <span class="suggest-label">参考建议</span>
                  <span class="suggest-val">{{ wbCurrent.suggestions[field.key].value }}</span>
                  <el-tag size="small" type="info">{{ wbCurrent.suggestions[field.key].source }}</el-tag>
                  <span class="suggest-sample">样本 {{ wbCurrent.suggestions[field.key].sample }}</span>
                  <el-button link type="primary" size="small" @click="applySuggest(field)">采纳</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="wb-footer">
            <span class="footer-hint">暂存/提交成功后自动进入下一条可治理设备</span>
            <span>
              <el-button @click="wbSave">暂存</el-button>
              <el-button type="primary" @click="wbSubmit">提交审核</el-button>
              <el-button :disabled="!wbView.length" @click="wbNext">下一条</el-button>
            </span>
          </div>
        </section>
        <section v-else class="wb-form empty">
          <div class="wb-form-scroll">请从左侧选择设备</div>
          <div class="wb-footer">
            <span class="footer-hint">暂存/提交成功后自动进入下一条可治理设备</span>
            <el-button :disabled="!wbView.length" @click="wbNext">下一条</el-button>
          </div>
        </section>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="exportOpen" title="导出填报" width="640px" :close-on-click-modal="false">
    <div class="hint" style="margin-bottom:8px">范围是已勾选设备；没勾选时导出当前筛选里仍可填写的设备。单次最多 1 万台。取消勾选的项只作核对列，导入时不覆盖。原始名称、通道编码、现有规范名称始终是核对列。</div>
    <el-checkbox v-for="item in oneItemOptions" :key="item.value" :model-value="exportKeys.indexOf(item.value)>=0" @change="toggleExportKey(item.value, $event)">{{ item.label }}</el-checkbox>
    <template #footer><el-button @click="exportOpen=false">取消</el-button><el-button type="primary" @click="doExport">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="importOpen" title="导入填报" width="860px" :close-on-click-modal="false">
    <div class="hint" style="margin-bottom:8px">使用本任务刚导出的表。空的规范名称保持原值。同一文件内、以及和该生效目录下其他设备不能重名，最多 50 字。已锁定的名称即使改了也不写入。任务编号或通道对不上的行失败，其余行仍写入。</div>
    <div style="margin-bottom:8px"><el-button @click="seedImportErrors">放入错误示例</el-button></div>
    <el-table :data="importRows" max-height="320" size="small">
      <el-table-column prop="taskCode" label="任务编号" width="140"/>
      <el-table-column prop="channelId" label="通道编码" width="170" show-overflow-tooltip/>
      <el-table-column prop="name" label="原始设备名称" min-width="140" show-overflow-tooltip/>
      <el-table-column prop="existingName" label="现有规范名称" min-width="140" show-overflow-tooltip/>
      <el-table-column label="设备规范名称" min-width="180">
        <template #default="{ row }"><el-input v-model="row.standardName" maxlength="80" size="small"/></template>
      </el-table-column>
    </el-table>
    <el-alert v-if="importResult" style="margin-top:12px" :type="importResult.fail ? 'warning' : 'success'" :closable="false" :title="'成功 ' + importResult.ok + ' 行，失败 ' + importResult.fail + ' 行' + (importResult.ignored ? ('，已忽略锁定列 ' + importResult.ignored + ' 处') : '') + '。'"/>
    <el-table v-if="importResult && importResult.fails.length" :data="importResult.fails" size="small" max-height="180" style="margin-top:8px">
      <el-table-column prop="no" label="行" width="60"/>
      <el-table-column prop="name" label="原始设备名称" min-width="140"/>
      <el-table-column prop="reason" label="失败原因" min-width="220"/>
    </el-table>
    <template #footer><el-button @click="importOpen=false">关闭</el-button><el-button type="primary" @click="runImport">开始导入</el-button></template>
  </el-dialog>

  <el-drawer v-model="dcOpen" class="sheet-drawer" direction="btt" size="80%" :with-header="false" :close-on-click-modal="false">
    <div class="dc-shell">
      <div class="wb-header"><div><strong>配置绑定设备</strong><span class="wb-sub">{{ dcTask ? dcTask.name : '' }}</span></div><el-button link @click="dcOpen=false">关闭</el-button></div>
      <div class="dc-body dc-condition">
        <div class="dc-cond">
          <div class="panel-title">圈选条件</div>
          <div class="cond-desc">设置条件后点「预览命中」，确认后把这批通道加入任务。各项条件同时满足。治理项缺失勾了多项时，命中缺其中任意一项的设备。</div>
          <div class="cond-body">
            <div class="dir-picker">
              <div class="dir-current">
                <span class="dir-label">目录范围</span>
                <span class="dir-path">{{ taskHasName(dcTask) ? catalogLabel(dcTask.nameCatalog) : (dcFilters.dir ? dcDirLabel : '全部目录') }}</span>
                <el-button v-if="!taskHasName(dcTask)" link type="primary" size="small" @click="dcDirExpand=!dcDirExpand">{{ dcDirExpand ? '收起' : '更改' }}</el-button>
              </div>
              <div v-if="taskHasName(dcTask)" class="prefill-desc">本任务勾了规范名称，只能绑定生效目录下的设备。</div>
              <div v-if="dcDirExpand && !taskHasName(dcTask)" class="dir-tree-panel">
                <div class="dir-tree-toolbar">
                  <el-select v-model="dcFilters.scope" size="small" placeholder="全部" clearable style="width:120px" @change="dcFilters.dir=''">
                    <el-option label="原始目录" value="original"/>
                    <el-option v-if="mode==='three'" label="基础目录" value="base"/>
                    <el-option v-if="mode==='three'" label="业务目录" value="business"/>
                  </el-select>
                </div>
                <el-tree :data="scopeDirTree" node-key="id" highlight-current default-expand-all @node-click="dcPickDir"/>
              </div>
            </div>
            <el-form label-position="top" size="small">
              <el-form-item label="原始设备名称"><el-input v-model="dcFilters.name" placeholder="请输入" clearable maxlength="200"/></el-form-item>
              <el-form-item label="平台编码"><el-input v-model="dcFilters.deviceId" placeholder="请输入" clearable maxlength="200"/></el-form-item>
              <el-form-item label="通道编码"><el-input v-model="dcFilters.channelId" placeholder="请输入" clearable maxlength="200"/></el-form-item>
              <el-form-item label="在线状态">
                <el-select v-model="dcFilters.online" placeholder="请选择" clearable style="width:100%"><el-option label="在线" :value="1"/><el-option label="离线" :value="0"/></el-select>
              </el-form-item>
              <el-form-item label="行政区划"><el-cascader v-model="dcFilters.area" :options="catRegionOptions" :props="catRegionProps" clearable placeholder="请选择" style="width:100%"/></el-form-item>
              <el-form-item label="管理单位"><el-tree-select v-model="dcFilters.unit" :data="dcUnitTree" check-strictly clearable placeholder="请选择" style="width:100%"/></el-form-item>
              <el-form-item label="业务标签"><el-tree-select v-model="dcFilters.tags" :data="dcTagTree" multiple show-checkbox clearable placeholder="请选择" style="width:100%"/></el-form-item>
              <el-form-item label="治理项缺失" class="span2">
                <el-checkbox-group v-model="dcFilters.missing" size="small">
                  <el-checkbox v-if="taskHasName(dcTask)" label="name">设备规范名称</el-checkbox>
                  <el-checkbox label="coord">经纬度</el-checkbox>
                  <el-checkbox label="unit">管理单位</el-checkbox>
                  <el-checkbox label="area">行政区划</el-checkbox>
                  <el-checkbox label="type">设备类型</el-checkbox>
                  <el-checkbox label="vendor">设备厂商</el-checkbox>
                  <el-checkbox label="install">安装日期</el-checkbox>
                  <el-checkbox label="warranty">维保到期日</el-checkbox>
                  <el-checkbox label="tag">业务标签</el-checkbox>
                  <el-checkbox label="addr">详细地址</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div class="cond-actions">
              <el-button type="primary" @click="dcSearch">预览命中</el-button>
              <el-button @click="dcReset">重置</el-button>
            </div>
          </div>
        </div>
        <div class="dc-preview">
          <div class="panel-title">
            <span class="dc-bind-switch">
              <el-radio-group v-model="dcBindTab" size="small" @change="dcBindTabChange">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="out">未加入</el-radio-button>
                <el-radio-button label="in">已加入</el-radio-button>
              </el-radio-group>
              <el-tag v-if="dcTableView.length" size="small" type="primary">共 {{ dcTableView.length }} 台</el-tag><el-tag v-else size="small" type="info">无命中</el-tag>
            </span>
            <span><el-button :disabled="!dcChecked.length" @click="dcBatch(false)">移出所选</el-button><el-button type="primary" :disabled="!dcTableView.length" @click="dcBatch(true)">{{ dcChecked.length ? ('加入所选 ' + dcChecked.length + ' 台') : ('全部加入 ' + dcTableView.length + ' 台') }}</el-button></span>
          </div>
          <el-table ref="dcTableRef" :data="dcPageView" row-key="id" height="100%" @selection-change="dcChecked=$event">
            <el-table-column type="selection" width="42" reserve-selection/>
            <el-table-column label="原始设备名称" min-width="170"><template #default="{ row }"><span class="name-cell"><span class="name-text">{{ row.name }}</span><el-tooltip v-if="row.deleted" content="该设备在源表已删除无法治理，建议解绑"><el-tag type="danger" size="small">已删除</el-tag></el-tooltip></span></template></el-table-column>
            <el-table-column prop="deviceId" label="平台编码" width="170" show-overflow-tooltip/>
            <el-table-column prop="channelId" label="通道编码" width="170" show-overflow-tooltip/>
            <el-table-column label="在线" width="64"><template #default="{ row }"><el-tag :type="row.online===1?'success':'info'" size="small">{{ row.online===1?'在线':'离线' }}</el-tag></template></el-table-column>
            <el-table-column prop="area" label="行政区划" width="140" show-overflow-tooltip/>
            <el-table-column prop="unit" label="管理单位" width="100" show-overflow-tooltip/>
            <el-table-column prop="tags" label="业务标签" width="100" show-overflow-tooltip/>
            <el-table-column label="缺失项" min-width="140"><template #default="{ row }"><span v-if="dcMissingLabels(row).length"><span v-for="name in dcMissingLabels(row)" :key="name" class="miss-tag">{{ name }}</span></span><span v-else class="miss-none">—</span></template></el-table-column>
            <el-table-column label="绑定" width="72"><template #default="{ row }"><el-tooltip :disabled="!(row.deleted && !row.bind)" content="源表已删除，不能加入"><span class="op-tip"><el-switch :model-value="row.bind" :disabled="row.deleted && !row.bind" @change="dcToggle(row, $event)"/></span></el-tooltip></template></el-table-column>
          </el-table>
          <div v-if="dcTableView.length" class="preview-bar">已勾选 {{ dcChecked.length }} 台，翻页后仍保留。未勾选时，加入本次命中里尚未进入任务的设备。源表已删除的不加入。</div>
          <div class="pager"><el-pagination background layout="total, prev, pager, next, sizes" :total="dcTableView.length" :current-page="dcPage" :page-size="dcPageSize" :page-sizes="[10,20,50]" @current-change="dcPageChange" @size-change="dcSizeChange"/></div>
        </div>
      </div>
    </div>
  </el-drawer>
  <el-dialog v-model="govBatchOpen" title="批量填写" width="760px" :close-on-click-modal="false">
    <template v-if="govBatchStep==='confirm' && govNamePlan && taskNameRule">
      <div class="name-plan">{{ taskNameRule.hint }}</div>
      <div class="name-plan">本批 {{ govChecked.length }} 台：将生成 {{ govNamePlan.generate.length }} 台，跳过已有 {{ govNamePlan.skipHas.length }} 台，跳过已锁定 {{ govNamePlan.skipLock.length }} 台，跳过手改 {{ govNamePlan.skipManual.length }} 台。</div>
      <div class="hint">已有规范名称不覆盖，手改过的不再自动覆盖。生成后未锁定项都齐的设备进入待审核。</div>
      <el-table v-if="govNamePlan.generate.length" :data="govNamePlan.generate.slice(0, 5)" size="small" style="margin-top:8px">
        <el-table-column label="原始设备名称" min-width="160"><template #default="{ row }">{{ row.row.name }}</template></el-table-column>
        <el-table-column label="将生成的规范名称" min-width="220"><template #default="{ row }">{{ row.name }}</template></el-table-column>
      </el-table>
    </template>
    <template v-else>
    <div style="margin-bottom:12px">已选择设备 <b>{{ govChecked.length }}</b> 条</div>
    <el-alert type="info" show-icon :closable="false" style="margin-bottom:12px" title="留空表示本批次不修改该字段（不会清空）。提交时按「本批填写 + 设备已有值」合并后校验：未锁定项都填齐的设备进入待审核，仍有缺项的保留原状态。"/>
    <div class="batch-scroll">
      <div v-if="taskNameRule" class="batch-name">
        <div class="gov-label">设备规范名称</div>
        <div class="name-plan">{{ taskNameRule.hint }}</div>
        <el-checkbox v-model="govBatchName">按规则逐台生成尚未填写的规范名称</el-checkbox>
        <div class="hint">不把这一批写成同一个名字。已有名称、已锁定、手改过的都会跳过。</div>
      </div>
      <el-form label-position="top">
        <el-form-item v-if="activeItemNames.indexOf('管理单位')>=0" label="管理单位"><el-cascader :options="dcUnitTree" :props="{ value:'value', label:'label', children:'children', emitPath:true }" clearable placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('行政区划')>=0" label="行政区划"><el-cascader :options="catRegionOptions" :props="catRegionProps" clearable placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('详细地址')>=0" label="详细地址"><el-input maxlength="200" placeholder="不填则保留原值，不做修改" @input="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('设备类型')>=0" label="设备类型"><el-select clearable placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"><el-option v-for="t in ['枪机','半球','球机','鹰眼','全景','梯半球','针孔']" :key="t" :label="t" :value="t"/></el-select></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('设备厂商')>=0" label="设备厂商"><el-input maxlength="50" placeholder="不填则保留原值，不做修改" @input="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('安装日期')>=0" label="安装日期"><el-date-picker type="date" value-format="YYYY-MM-DD" placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('维保到期日')>=0" label="维保到期日"><el-date-picker type="date" value-format="YYYY-MM-DD" placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"/></el-form-item>
        <el-form-item v-if="activeItemNames.indexOf('业务标签')>=0" label="业务标签"><el-tree-select :data="dcTagTree" multiple show-checkbox clearable placeholder="不填则保留原值，不做修改" style="width:100%" @change="govBatchTouched=true"/></el-form-item>
        <div v-if="activeItemNames.indexOf('经纬度')>=0" class="hint">经纬度不在批量填写里。请到连续治理逐台选点，需要时点「沿用上一台」。</div>
      </el-form>
    </div>
    </template>
    <template #footer>
      <el-button v-if="govBatchStep==='confirm'" @click="govBatchStep='form'">返回</el-button>
      <el-button v-else @click="govBatchOpen=false">取消</el-button>
      <el-button type="primary" @click="submitGovBatch">{{ govBatchStep==='confirm' ? '确认生成' : '确定' }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="govDetailOpen" title="设备详情" width="640px" :close-on-click-modal="false">
    <template v-if="govDetailRow">
      <el-alert :type="govDetailRow.status==='4'?'success':'info'" show-icon :closable="false" style="margin-bottom:12px" :title="govDetailRow.status==='4'?'已完成：只读查看':'待审核：只读查看，请从审核入口处理'"/>
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="原始名称">{{ govDetailRow.name }}</el-descriptions-item>
        <el-descriptions-item label="平台编码">{{ govDetailRow.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="通道编码">{{ govDetailRow.channelId }}</el-descriptions-item>
        <el-descriptions-item v-for="field in wbFields" :key="field.key" :label="field.label">{{ field.key==='standardName' && taskHasName(activeGovTask) ? (catalogName(govDetailRow, activeGovTask.nameCatalog) || '—') : (field.kind==='lng' ? (govDetailRow.values.lng + ',' + govDetailRow.values.lat) : govDetailRow.values[field.key]) }}</el-descriptions-item>
      </el-descriptions>
    </template>
  </el-dialog>
  <el-drawer v-model="audOpen" class="sheet-drawer" direction="btt" size="90%" :with-header="false" :close-on-click-modal="false">
    <div class="wb">
      <div class="wb-header"><div><strong>连续审核</strong><span class="wb-sub">{{ activeGovTask ? activeGovTask.name : '' }}</span></div><el-button link @click="audClose">关闭</el-button></div>
      <el-alert v-if="taskNameRule" type="info" show-icon :closable="false" style="margin:0 16px 8px" :title="'通过的规范名称只回写到「' + taskNameRule.label + '」，不改其他目录，也不改原始名称。'" />
      <div class="wb-body">
        <aside class="wb-list">
          <div class="wb-list-toolbar">
            <el-input v-model="audWbQuery.name" placeholder="请输入原始设备名称" clearable maxlength="200" size="small" style="width:170px"/>
            <el-input v-model="audWbQuery.deviceId" placeholder="请输入平台编码" clearable maxlength="200" size="small" style="width:150px"/>
            <el-input v-model="audWbQuery.channelId" placeholder="请输入通道编码" clearable maxlength="200" size="small" style="width:150px"/>
            <el-button type="primary" plain size="small" @click="audWbSearch">查询</el-button>
            <el-button type="danger" plain size="small" @click="audWbReset">重置</el-button>
          </div>
          <el-table :data="audWbView" size="small" row-key="id" :row-class-name="audRowClass" @row-click="audSelect">
            <el-table-column prop="name" label="原始名称" min-width="120" show-overflow-tooltip/>
            <el-table-column prop="deviceId" label="平台编码" width="140" show-overflow-tooltip/>
            <el-table-column prop="channelId" label="通道编码" width="140" show-overflow-tooltip/>
            <el-table-column width="90">
              <template #header>进度 <el-tooltip content="已通过字段数 / 本任务治理项总数"><span class="th-tip">?</span></el-tooltip></template>
              <template #default="{ row }">{{ audPassedText(row) }} 已通过</template>
            </el-table-column>
            <el-table-column label="状态" width="130">
              <template #default="{ row }"><el-tag :type="govStatusType[row.status]" size="small">{{ govStatusText[row.status] }}</el-tag><el-tag v-if="row.resubmit" type="warning" size="small" style="margin-left:4px">重交</el-tag></template>
            </el-table-column>
          </el-table>
        </aside>
        <section v-if="audCurrent" class="wb-form">
          <div class="wb-form-scroll">
            <el-descriptions :column="3" size="small" border style="margin-bottom:12px">
              <el-descriptions-item label="原始名称">{{ audCurrent.name }}</el-descriptions-item>
              <el-descriptions-item label="平台编码">{{ audCurrent.deviceId }}</el-descriptions-item>
              <el-descriptions-item label="通道编码">{{ audCurrent.channelId }}</el-descriptions-item>
            </el-descriptions>
            <el-alert v-if="audCurrent.status==='2' && audTip.text" :type="audTip.type" show-icon :closable="false" style="margin-bottom:12px" :title="audTip.text"/>
            <el-alert v-if="audAreaHint" type="warning" show-icon :closable="false" style="margin-bottom:12px" :title="audAreaHint"/>
            <el-table :data="audTaskFields(audCurrent)" size="small">
              <el-table-column prop="label" label="字段" width="140"/>
              <el-table-column label="新值" min-width="220"><template #default="{ row }"><el-tag v-if="row.locked" type="success" size="small">已通过</el-tag><span v-else :class="{ 'val-diff': audIsDiff(row) }">{{ row.next }}</span><el-tag v-if="!row.locked && audIsDiff(row)" size="small" type="warning" style="margin-left:6px">变更</el-tag><div v-if="row.prefillBy" class="prefill-mark">预填 · {{ row.prefillBy }} · {{ row.prefillAt }}</div></template></el-table-column>
              <el-table-column label="当前值" width="180"><template #default="{ row }"><span v-if="row.locked">—</span><span v-else :class="{ 'val-old': audIsDiff(row) }">{{ row.current }}</span></template></el-table-column>
              <el-table-column label="审核" width="180">
                <template #default="{ row }">
                  <el-tag v-if="row.locked" type="success" size="small">已通过（免审）</el-tag>
                  <el-radio-group v-else-if="audCurrent.status==='2'" v-model="audReview[row.key]" @change="audMark">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">驳回</el-radio>
                  </el-radio-group>
                  <span v-else>—</span>
                </template>
              </el-table-column>
            </el-table>
            <el-form v-if="audCurrent.status==='2'" label-width="80px" style="margin-top:16px">
              <el-form-item label="审核意见">
                <div style="width:100%">
                  <div class="quick-reasons"><span class="qr-label">常用理由</span><el-tag v-for="r in audQuickReasons" :key="r" size="small" class="qr-tag" @click="pickAudComment(r)">{{ r }}</el-tag></div>
                  <el-input v-model="audComment" type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入审核意见，存在驳回字段时必填" @input="audMark"/>
                </div>
              </el-form-item>
            </el-form>
            <el-alert v-else-if="audCurrent.comments" type="error" show-icon :closable="false" style="margin-top:16px" :title="'审核意见：' + audCurrent.comments"/>
          </div>
          <div class="wb-footer">
            <span class="footer-hint">提交成功后自动进入下一条待审核设备</span>
            <span>
              <el-button v-if="audCurrent.status==='2'" type="primary" @click="audSubmit">提交</el-button>
              <el-button :disabled="!audWbView.length" @click="audNext">下一条</el-button>
            </span>
          </div>
        </section>
        <section v-else class="wb-form empty">
          <div class="wb-form-scroll">请从左侧选择设备</div>
          <div class="wb-footer">
            <span class="footer-hint">提交成功后自动进入下一条待审核设备</span>
            <el-button :disabled="!audWbView.length" @click="audNext">下一条</el-button>
          </div>
        </section>
      </div>
    </div>
  </el-drawer>
  <el-dialog v-model="audRejectOpen" title="批量驳回" width="520px" :close-on-click-modal="false">
    <el-form label-width="80px">
      <el-form-item label="审核意见" required>
        <div style="width:100%">
          <div class="quick-reasons"><span class="qr-label">常用理由</span><el-tag v-for="r in audQuickReasons" :key="r" size="small" class="qr-tag" @click="pickAudReason(r)">{{ r }}</el-tag></div>
          <el-input v-model="audRejectComment" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入审核意见"/>
        </div>
      </el-form-item>
    </el-form>
    <template #footer><el-button @click="audRejectOpen=false">取消</el-button><el-button type="primary" @click="confirmAudReject">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="audGroupOpen" title="批量通过（按取值分组）" width="640px" :close-on-click-modal="false">
    <div style="margin-bottom:10px">已勾选 <b>{{ audChecked.length }}</b> 台待审核设备。按字段取值分组如下，确认后整组通过。</div>
    <div v-for="g in audGroups" :key="g.key" class="aud-group">
      <div class="aud-group-title">{{ g.groups[0].label }}</div>
      <div class="aud-group-list">
        <div v-for="item in g.groups" :key="item.value" class="aud-group-item">
          <span class="aud-group-val">{{ item.value }}</span>
          <span class="aud-group-count">{{ item.count }} 台</span>
          <span class="aud-group-sample">{{ item.devices.slice(0,3).join('、') }}{{ item.devices.length>3?' 等':'' }}</span>
        </div>
      </div>
    </div>
    <template #footer><el-button @click="audGroupOpen=false">取消</el-button><el-button type="primary" @click="confirmAudGroupPass">全部通过</el-button></template>
  </el-dialog>

  <el-dialog v-model="audDetailOpen" title="设备详情" width="640px" :close-on-click-modal="false">
    <template v-if="audDetailRow">
      <el-alert :type="audDetailRow.status==='4'?'success':'error'" show-icon :closable="false" style="margin-bottom:12px" :title="audDetailRow.status==='4'?'已完成：字段已落库，只读查看':'已退回：请等待治理人修改后重新提交'"/>
      <el-alert v-if="audDetailRow.comments" type="warning" show-icon :closable="false" style="margin-bottom:12px" :title="'审核意见：' + audDetailRow.comments"/>
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="原始名称">{{ audDetailRow.name }}</el-descriptions-item>
        <el-descriptions-item label="平台编码">{{ audDetailRow.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="通道编码">{{ audDetailRow.channelId }}</el-descriptions-item>
        <el-descriptions-item v-for="field in audTaskFields(audDetailRow)" :key="field.key" :label="field.label">
          <span>{{ field.next }}</span>
          <el-tag v-if="field.locked" type="success" size="small" style="margin-left:8px">已通过</el-tag>
          <el-tag v-else-if="field.rejected" type="danger" size="small" style="margin-left:8px">已驳回</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </el-dialog>

  <el-dialog v-model="prefillOpen" title="预填" width="640px" :close-on-click-modal="false">
    <div class="prefill-desc">只显示本任务已勾选、并且可以整批相同的治理项。规范名称、经纬度不在这里填。派单后写入每台明细，设备仍是待治理。</div>
    <div v-if="prefillTask && prefillOf(String(prefillTask.items||'').split('、')).length" class="prefill-grid">
      <div v-for="f in prefillOf(String(prefillTask.items||'').split('、'))" :key="f.key" class="prefill-cell">
        <label>{{ f.label }}</label>
        <el-input v-if="f.kind==='text'" v-model="taskPrefill[f.key]" size="small" placeholder="整批相同则填"/>
        <el-select v-else-if="f.kind==='select'" v-model="taskPrefill[f.key]" size="small" clearable placeholder="请选择" style="width:100%"><el-option v-for="o in f.options" :key="o" :label="o" :value="o"/></el-select>
        <el-date-picker v-else-if="f.kind==='date'" v-model="taskPrefill[f.key]" type="date" value-format="YYYY-MM-DD" size="small" placeholder="请选择日期" style="width:100%"/>
        <el-tree-select v-else-if="f.kind==='tree' && f.options==='dcUnitTree'" v-model="taskPrefill[f.key]" :data="dcUnitTree" check-strictly clearable size="small" placeholder="请选择" style="width:100%"/>
        <el-tree-select v-else-if="f.kind==='tree' && f.options==='dcTagTree'" v-model="taskPrefill[f.key]" :data="dcTagTree" multiple show-checkbox clearable size="small" placeholder="请选择" style="width:100%"/>
        <el-cascader v-else-if="f.kind==='cascader'" v-model="taskPrefill[f.key]" :options="catRegionOptions" :props="catRegionProps" clearable size="small" placeholder="请选择" style="width:100%"/>
      </div>
    </div>
    <div v-else class="prefill-desc">本任务勾选的治理项都不能整批预填。</div>
    <template #footer><el-button @click="prefillOpen=false">取消</el-button><el-button type="primary" @click="saveTaskPrefill">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="zoomOpen" title="按级设置缩放" width="520px">
    <div class="hint" style="margin-top:0">按层级统一设置该级全部节点的缩放。</div>
    <el-form label-width="100px">
      <el-form-item label="省"><el-input v-model="zoomLevels.prov" placeholder="留空不修改"/></el-form-item>
      <el-form-item label="市"><el-input v-model="zoomLevels.city" placeholder="留空不修改"/></el-form-item>
      <el-form-item label="区县"><el-input v-model="zoomLevels.county" placeholder="留空不修改"/></el-form-item>
      <el-form-item label="乡镇/街道"><el-input v-model="zoomLevels.town" placeholder="留空不修改"/></el-form-item>
    </el-form>
    <div class="hint">仅修改缩放，不修改中心经纬度。留空的级别不修改；无中心点或已停用的节点将跳过。已填级别须满足省＜市＜区县＜乡镇/街道，否则本次不保存。</div>
    <template #footer><el-button @click="zoomOpen=false">取消</el-button><el-button type="primary" @click="applyLevelZoom">确定</el-button></template>
  </el-dialog>

  <el-dialog v-model="unbindOpen" title="绑定设备" width="640px">
    <el-table :data="[{name:'西湖小区东门监控',at:'文新派出所'},{name:'学校门口球机',at:'文新派出所'}]">
      <el-table-column type="selection" width="42"/>
      <el-table-column prop="name" label="设备名称"/>
      <el-table-column prop="at" label="直接绑定"/>
    </el-table>
    <template #footer>
      <el-button @click="unbindOpen=false">取消</el-button>
      <el-button type="primary" @click="unbindOpen=false; ElMessage.success('已解绑，治理状态已重算')">解绑所选</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="catLogOpen" title="更新记录" width="640px" :close-on-click-modal="false">
    <template v-if="catLogRow">
      <div class="chg-name">{{ catLogRow.name }}</div>
      <p class="chg-lead">每天 22:00 自动更新。移出是不再留在目录里的位置，加进来是新出现的位置。不会删除设备。</p>
      <el-table :data="catLogRow.logs || []" size="small" empty-text="尚无更新记录">
        <el-table-column prop="time" label="更新时间" min-width="170"/>
        <el-table-column label="移出" width="100"><template #default="{ row }">{{ fmtCount(row.off) }}</template></el-table-column>
        <el-table-column label="加进来" width="100"><template #default="{ row }">{{ fmtCount(row.on) }}</template></el-table-column>
        <el-table-column label="更新后" width="120"><template #default="{ row }">{{ fmtCount(row.after) }}</template></el-table-column>
      </el-table>
    </template>
  </el-dialog>

</div>`
}).use(ElementPlus, { locale: window.ElementPlusLocaleZhCn }).mount("#app")
