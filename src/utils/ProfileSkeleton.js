import { c as L, a as N } from "./index.esm-3777a709.js";
import { a as V, u as M, _ as P } from "./InputCustom-fbb39e16.js";
import { C as T } from "./common-c2ad2760.js";
import {
  r as k,
  o as n,
  c,
  b as s,
  t as _,
  n as B,
  v as C,
  i,
  j as a,
  k as F,
  z as u,
  B as j,
  m as O,
  a0 as U,
  s as h,
  D as E,
  Q as y,
  q as R,
  a2 as G,
  Z as I,
  h as A,
  I as J,
  K as H,
  E as K,
} from "./index-a2293878.js";
import { _ as Q, a as W } from "./DropdownCustom-ada9febd.js";
const Z = { class: "flex flex-column gap-2" },
  X = { class: "font-semibold" },
  Y = { class: "p-error" },
  ee = { class: "flex flex-column gap-1 w-full" },
  se = {
    __name: "TextareaCustom",
    props: {
      name: { type: String, required: !0, default: "" },
      label: { type: String, required: !1, default: "" },
      required: { type: Boolean, required: !1, default: !1 },
      class: { type: String, required: !1, default: "" },
      style: { type: Object, required: !1, default: {} },
      disabled: { type: Boolean, required: !1, default: !1 },
      placeholder: { type: String, required: !1, default: "" },
      autoResize: { type: Boolean, required: !1, default: !0 },
      rows: { type: Number, required: !1, default: 5 },
      cols: { type: Number, required: !1, default: 30 },
      variant: { type: String, required: !1, default: "" },
    },
    emits: ["onChange"],
    setup(w, { emit: d }) {
      const e = w,
        { value: t, errorMessage: g } = V(e.name);
      return (v, m) => {
        const f = k("Textarea");
        return (
          n(),
          c("div", Z, [
            s("label", null, [
              s("span", X, _(e.label), 1),
              B(s("span", Y, " *", 512), [[C, e.required]]),
            ]),
            s("div", ee, [
              i(
                f,
                {
                  modelValue: a(t),
                  "onUpdate:modelValue":
                    m[0] || (m[0] = (x) => (F(t) ? (t.value = x) : null)),
                  autoResize: e.autoResize,
                  rows: e.rows,
                  cols: e.cols,
                  variant: e.variant,
                  class: u(e.class),
                  style: j(e.style),
                  disabled: e.disabled,
                  placeholder: e.placeholder,
                  onChange: m[1] || (m[1] = (x) => d("onChange")),
                },
                null,
                8,
                [
                  "modelValue",
                  "autoResize",
                  "rows",
                  "cols",
                  "variant",
                  "class",
                  "style",
                  "disabled",
                  "placeholder",
                ]
              ),
              B(s("small", { class: "p-error" }, _(a(g)), 513), [[C, a(g)]]),
            ]),
          ])
        );
      };
    },
  },
  ae = { class: u(["flex flex-column gap-2"]) },
  le = { class: "font-semibold" },
  te = { class: "p-error" },
  re = { class: "flex flex-column gap-1" },
  ne = { key: 0, class: "pi pi-plus" },
  oe = { key: 1, class: "flex flex-column gap-1 align-items-center" },
  ie = s("i", { class: "pi pi-camera text-2xl" }, null, -1),
  ce = { class: "text-sm" },
  ue = ["accept", "onDrop"],
  de = { class: "flex flex-column gap-1" },
  me = s("span", null, "Đang tải...", -1),
  fe = ["src"],
  pe = { key: 1, class: "w-full h-full", controls: "" },
  he = ["src"],
  _e = {
    key: 2,
    class: "w-full h-full flex align-items-center justify-content-center",
  },
  ge = { class: "flex flex-column" },
  be = s(
    "img",
    {
      class: "w-10rem h-10rem object-fit-cover",
      src: "https://cdn1.iconfinder.com/data/icons/fs-icons-ubuntu-by-franksouza-/512/application-x-rar.png",
      alt: "Lỗi ảnh",
    },
    null,
    -1
  ),
  ve = { class: "p-error" },
  ye = {
    __name: "ImageUploadCustom",
    props: {
      name: { type: String, required: !0, default: "" },
      label: { type: String, required: !1, default: "" },
      class: { type: String, required: !1, default: "w-12rem h-12rem" },
      style: { type: Object, required: !1, default: () => {} },
      disabled: { type: Boolean, required: !1, default: !1 },
      miniSize: { type: Boolean, required: !1, default: !1 },
      required: { type: Boolean, required: !1, default: !0 },
      imageProps: {
        type: Object,
        required: !1,
        default: () => ({
          maxSize: 100,
          accept: "image/*",
          type: "JPG,JPEG,PNG",
        }),
      },
    },
    emits: ["onUpload", "onRemove"],
    setup(w, { emit: d }) {
      const e = w,
        { value: t, errorMessage: g, setErrors: v, setValue: m } = V(e.name),
        f = O(!1),
        x = (l) => {
          const r = l / 1048576;
          return Number(r % 1 === 0 ? r.toFixed(0) : r.toFixed(2));
        },
        z = (l) => {
          var r, p;
          if (
            x(l.target.files[0].size) >
            Number(
              (r = e == null ? void 0 : e.imageProps) == null
                ? void 0
                : r.maxSize
            )
          )
            return (
              v(
                `Dung lượng tệp không được vượt quá ${
                  (p = e == null ? void 0 : e.imageProps) == null
                    ? void 0
                    : p.maxSize
                }MB`
              ),
              !0
            );
          if (
            !e.imageProps.type
              .toLowerCase()
              .split(",")
              .includes(
                l.target.files[0].name
                  .split(".")
                  [l.target.files[0].name.split(".").length - 1].toLowerCase()
              )
          )
            return v("Tệp không đúng định dạng"), !0;
        },
        $ = async (l) => {
          if (z(l)) return;
          f.value = !0;
          const r = 3145728;
          E.resizeImage(l.target.files[0], r, (p) => {
            const b = new FileReader();
            b.readAsDataURL(p),
              (b.onload = (D) => {
                D.target.result &&
                  m({ name: l.target.files[0].name, base64: D.target.result });
              }),
              (f.value = !1),
              d("onUpload", l);
          });
        },
        q = async (l) => {
          const r = { target: { files: [l.dataTransfer.files[0]] } };
          l.preventDefault(), $(r);
        },
        o = (l) => {
          switch (l) {
            case "image/*":
              return "ảnh";
            case "video/*":
              return "video";
            default:
              return "file";
          }
        },
        S = (l) => {
          m(null), d("onRemove", l);
        };
      return (l, r) => {
        var b;
        const p = k("ProgressSpinner");
        return (
          n(),
          c("div", ae, [
            B(
              s(
                "label",
                null,
                [
                  s("span", le, _(e.label), 1),
                  B(s("span", te, " *", 512), [[C, e.required]]),
                ],
                512
              ),
              [[C, e.label]]
            ),
            s("div", re, [
              s(
                "div",
                {
                  class: u([
                    "text-main-color border-round-lg",
                    { "p-disabled": e.disabled },
                    e.class,
                  ]),
                },
                [
                  !a(t) && !f.value
                    ? (n(),
                      c(
                        "div",
                        {
                          key: 0,
                          class: u([
                            "w-full h-full relative flex align-items-center justify-content-center border-1 border-dashed main-color",
                            e.class,
                          ]),
                        },
                        [
                          e.miniSize
                            ? (n(), c("i", ne))
                            : (n(),
                              c("div", oe, [
                                ie,
                                s(
                                  "span",
                                  ce,
                                  _(`Thêm ${o(e.imageProps.accept)}`),
                                  1
                                ),
                              ])),
                          s(
                            "input",
                            {
                              type: "file",
                              class:
                                "absolute top-0 right-0 left-0 bottom-0 opacity-0 on-click",
                              accept: e.imageProps.accept,
                              onDrop: U(q, ["prevent"]),
                              onChange: $,
                            },
                            null,
                            40,
                            ue
                          ),
                        ],
                        2
                      ))
                    : h("", !0),
                  f.value && !a(t)
                    ? (n(),
                      c(
                        "div",
                        {
                          key: 1,
                          class: u([
                            e.class,
                            "relative flex justify-content-center align-items-center",
                          ]),
                        },
                        [
                          s("div", de, [
                            i(p, {
                              style: { width: "40px", height: "40px" },
                              strokeWidth: "3",
                              animationDuration: ".5s",
                            }),
                            me,
                          ]),
                        ],
                        2
                      ))
                    : h("", !0),
                  a(t) && !f.value
                    ? (n(),
                      c(
                        "div",
                        {
                          key: 2,
                          class: u([e.class, "relative"]),
                          style: j(e.style),
                        },
                        [
                          s("i", {
                            style: {
                              "background-color": "rgba(240, 248, 255, 0.767)",
                            },
                            class:
                              "pi pi-times absolute right-0 p-1 border-round-lg on-click z-5",
                            onClick: r[0] || (r[0] = (D) => S(a(t))),
                          }),
                          e.imageProps.accept === "image/*"
                            ? (n(),
                              c(
                                "img",
                                {
                                  key: 0,
                                  style: { "object-fit": "cover" },
                                  class: u([
                                    "border-1 main-color border-dashed",
                                    e.class,
                                  ]),
                                  src:
                                    a(t).base64 || "/images/avatar-default.jpg",
                                  onerror:
                                    "this.onerror=null; this.src='/images/avatar-default.jpg';",
                                },
                                null,
                                10,
                                fe
                              ))
                            : h("", !0),
                          e.imageProps.accept === "video/*"
                            ? (n(),
                              c("video", pe, [
                                s(
                                  "source",
                                  { src: a(t).base64, type: "video/mp4" },
                                  null,
                                  8,
                                  he
                                ),
                              ]))
                            : h("", !0),
                          e.imageProps.accept === "file/rar"
                            ? (n(),
                              c("div", _e, [
                                s("div", ge, [
                                  be,
                                  s(
                                    "span",
                                    null,
                                    _((b = a(t)) == null ? void 0 : b.name),
                                    1
                                  ),
                                ]),
                              ]))
                            : h("", !0),
                        ],
                        6
                      ))
                    : h("", !0),
                ],
                2
              ),
              s("small", ve, _(a(g)), 1),
            ]),
          ])
        );
      };
    },
  },
  xe = { class: "flex flex-column gap-3" },
  we = {
    __name: "ProfileSkeleton",
    setup(w) {
      return (d, e) => {
        const t = k("Skeleton"),
          g = k("Button");
        return (
          n(),
          c("div", xe, [
            i(t, { class: "w-full h-10rem" }),
            i(
              t,
              { class: u(`${a(y) ? "h-28rem" : "h-16rem"} w-full`) },
              null,
              8,
              ["class"]
            ),
            i(t, { class: "w-full h-10rem" }),
            a(y)
              ? (n(), R(g, { key: 0, label: "Lưu thông tin", disabled: !0 }))
              : h("", !0),
          ])
        );
      };
    },
  },
  $e = { key: 1, class: "flex flex-column gap-3" },
  ke = { class: "flex gap-3" },
  qe = { class: "flex flex-column gap-1" },
  Se = { class: "font-bold" },
  Ne = { key: 0 },
  Pe = { class: "flex gap-3 flex-wrap" },
  Be = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  Ce = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  ze = { class: "flex gap-3 flex-wrap" },
  De = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  Re = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  Ve = { class: "flex gap-3 flex-wrap" },
  je = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  Oe = {
    style: { "max-width": "27rem", "min-width": "20rem" },
    class: "flex-1",
  },
  Ee = {
    __name: "Profile",
    setup(w) {
      var q;
      const {
          onGetterProfile: d,
          onActionGetProfile: e,
          onActionSaveProfile: t,
        } = G(),
        g = {
          userId: (q = I.value) == null ? void 0 : q.userId,
          avatar: null,
          lastName: "",
          firstName: "",
          dateOfBirth: "",
          gender: "",
          phoneNumber: null,
          address: "",
          note: "",
        },
        v = O(!1),
        m = L({
          lastName: N().required("Vui lòng nhập họ"),
          firstName: N().required("Vui lòng nhập tên"),
          dateOfBirth: N().required("Vui lòng nhập ngày sinh"),
          gender: N().required("Vui lòng nhập giới tính"),
        }),
        {
          values: f,
          resetForm: x,
          handleSubmit: z,
        } = M({
          initialValues: g,
          validationSchema: m,
          keepValuesOnUnmount: !0,
        }),
        $ = z(async () => {
          (await t(f)).success &&
            e().then(({ result: S }) => {
              A.value.userData = T.onEncryptedData(S);
            });
        });
      return (
        J(d, (o) => {
          x({ values: o });
        }),
        H(async () => {
          (v.value = !0), await e(), (v.value = !1);
        }),
        (o, S) => {
          var r, p, b;
          const l = k("Button");
          return v.value
            ? (n(), R(we, { key: 0 }))
            : (n(),
              c("div", $e, [
                s(
                  "div",
                  {
                    class: u(
                      `w-full border-round-lg flex justify-content-between ${
                        a(y) ? "border-1 border-dashed main-color p-3" : "card"
                      }`
                    ),
                  },
                  [
                    s("div", ke, [
                      i(ye, {
                        name: "avatar",
                        class: "w-7rem h-7rem border-circle",
                        required: !1,
                      }),
                      s("div", qe, [
                        s(
                          "span",
                          Se,
                          _((r = a(d)) == null ? void 0 : r.fullName),
                          1
                        ),
                        s(
                          "span",
                          null,
                          _((p = a(d)) == null ? void 0 : p.age),
                          1
                        ),
                        s(
                          "span",
                          null,
                          _((b = a(d)) == null ? void 0 : b.email),
                          1
                        ),
                      ]),
                    ]),
                    a(y)
                      ? h("", !0)
                      : (n(),
                        c("div", Ne, [
                          i(
                            l,
                            {
                              label: o.$translation("Lưu thông tin"),
                              onClick: a($),
                            },
                            null,
                            8,
                            ["label", "onClick"]
                          ),
                        ])),
                  ],
                  2
                ),
                s(
                  "div",
                  {
                    class: u([
                      { card: !a(y) },
                      "w-full border-round-lg flex flex-column gap-3",
                    ]),
                  },
                  [
                    s("div", Pe, [
                      s("div", Be, [
                        i(
                          P,
                          {
                            label: o.$translation("Họ"),
                            name: "lastName",
                            required: !0,
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label"]
                        ),
                      ]),
                      s("div", Ce, [
                        i(
                          P,
                          {
                            label: o.$translation("Tên"),
                            name: "firstName",
                            required: !0,
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label"]
                        ),
                      ]),
                    ]),
                    s("div", ze, [
                      s("div", De, [
                        i(
                          Q,
                          {
                            label: o.$translation("Ngày sinh"),
                            required: !0,
                            name: "dateOfBirth",
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label"]
                        ),
                      ]),
                      s("div", Re, [
                        i(
                          W,
                          {
                            label: o.$translation("Giới tính"),
                            name: "gender",
                            required: !0,
                            options: a(K).GENDER_OPTION,
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label", "options"]
                        ),
                      ]),
                    ]),
                    s("div", Ve, [
                      s("div", je, [
                        i(
                          P,
                          {
                            label: o.$translation("Số điện thoại"),
                            name: "phoneNumber",
                            type: "number",
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label"]
                        ),
                      ]),
                      s("div", Oe, [
                        i(
                          P,
                          {
                            label: o.$translation("Địa chỉ"),
                            name: "address",
                            class: "w-full",
                          },
                          null,
                          8,
                          ["label"]
                        ),
                      ]),
                    ]),
                  ],
                  2
                ),
                s(
                  "div",
                  { class: u([{ card: !a(y) }, "w-full border-round-lg"]) },
                  [
                    i(
                      se,
                      {
                        label: o.$translation("Giới thiệu bản thân"),
                        name: "note",
                        class: "w-full",
                      },
                      null,
                      8,
                      ["label"]
                    ),
                  ],
                  2
                ),
                a(y)
                  ? (n(),
                    R(
                      l,
                      {
                        key: 0,
                        label: o.$translation("Lưu thông tin"),
                        onClick: a($),
                      },
                      null,
                      8,
                      ["label", "onClick"]
                    ))
                  : h("", !0),
              ]));
        }
      );
    },
  };
export { Ee as default };
