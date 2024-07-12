import initOpenCascade, {
  OpenCascadeInstance,
  TopoDS_Shape,
} from "opencascade.js";

let _occ: OpenCascadeInstance;

interface FaceItem {
  vertex_coord: number[];
  normal_coord: number[];
  tri_indexes: number[];
  number_of_triangles: number;
}

export async function initOcc() {
  _occ = await initOpenCascade();
}

export function getOcc(): OpenCascadeInstance {
  return _occ;
}

function getFacesByShape(shape: TopoDS_Shape) {
  const facelist = [];
  new _occ.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false);
  const ExpFace = new _occ.TopExp_Explorer_1();
  const TopAbs_FACE: any = _occ.TopAbs_ShapeEnum.TopAbs_FACE;
  const TopAbs_SHAPE: any = _occ.TopAbs_ShapeEnum.TopAbs_SHAPE;
  for (
    ExpFace.Init(shape, TopAbs_FACE, TopAbs_SHAPE);
    ExpFace.More();
    ExpFace.Next()
  ) {
    const myFace = _occ.TopoDS.Face_1(ExpFace.Current());
    const aLocation = new _occ.TopLoc_Location_1();
    const myT = _occ.BRep_Tool.Triangulation(
      myFace,
      aLocation,
      0 /* == Poly_MeshPurpose_NONE */
    );
    if (myT.IsNull()) {
      continue;
    }

    const this_face: FaceItem = {
      vertex_coord: [],
      normal_coord: [],
      tri_indexes: [],
      number_of_triangles: 0,
    };

    const pc = new _occ.Poly_Connect_2(myT);
    const triangulation = myT.get();

    // write vertex buffer
    this_face.vertex_coord = new Array(triangulation.NbNodes() * 3);
    for (let i = 1; i <= triangulation.NbNodes(); i++) {
      const p = triangulation.Node(i).Transformed(aLocation.Transformation());
      this_face.vertex_coord[(i - 1) * 3 + 0] = p.X();
      this_face.vertex_coord[(i - 1) * 3 + 1] = p.Y();
      this_face.vertex_coord[(i - 1) * 3 + 2] = p.Z();
    }

    // write normal buffer
    const myNormal = new _occ.TColgp_Array1OfDir_2(1, triangulation.NbNodes());
    _occ.StdPrs_ToolTriangulatedShape.Normal(myFace, pc, myNormal);
    this_face.normal_coord = new Array(myNormal.Length() * 3);
    for (let i = myNormal.Lower(); i <= myNormal.Upper(); i++) {
      const d = myNormal.Value(i).Transformed(aLocation.Transformation());
      this_face.normal_coord[(i - 1) * 3 + 0] = d.X();
      this_face.normal_coord[(i - 1) * 3 + 1] = d.Y();
      this_face.normal_coord[(i - 1) * 3 + 2] = d.Z();
    }

    // write triangle buffer
    const orient = myFace.Orientation_1();
    const triangles = myT.get().Triangles();
    this_face.tri_indexes = new Array(triangles.Length() * 3);
    let validFaceTriCount = 0;
    for (let nt = 1; nt <= myT.get().NbTriangles(); nt++) {
      const t = triangles.Value(nt);
      let n1 = t.Value(1);
      let n2 = t.Value(2);
      let n3 = t.Value(3);
      if (orient !== _occ.TopAbs_Orientation.TopAbs_FORWARD) {
        let tmp = n1;
        n1 = n2;
        n2 = tmp;
      }
      this_face.tri_indexes[validFaceTriCount * 3 + 0] = n1;
      this_face.tri_indexes[validFaceTriCount * 3 + 1] = n2;
      this_face.tri_indexes[validFaceTriCount * 3 + 2] = n3;
      validFaceTriCount++;
    }
    this_face.number_of_triangles = validFaceTriCount;
    facelist.push(this_face);
  }
  return facelist;
}

function joinPrimitives(faceList: FaceItem[]) {
  let obP = 0;
  let obN = 0;
  let obTR = 0;
  let advance = 0;
  const locVertexcoord: number[] = [];
  const locNormalcoord: number[] = [];
  const locTriIndices: number[] = [];

  faceList.forEach((myface) => {
    for (let x = 0; x < myface.vertex_coord.length / 3; x++) {
      locVertexcoord[obP * 3 + 0] = myface.vertex_coord[x * 3 + 0];
      locVertexcoord[obP * 3 + 1] = myface.vertex_coord[x * 3 + 1];
      locVertexcoord[obP * 3 + 2] = myface.vertex_coord[x * 3 + 2];
      obP++;
    }
    for (let x = 0; x < myface.normal_coord.length / 3; x++) {
      locNormalcoord[obN * 3 + 0] = myface.normal_coord[x * 3 + 0];
      locNormalcoord[obN * 3 + 1] = myface.normal_coord[x * 3 + 1];
      locNormalcoord[obN * 3 + 2] = myface.normal_coord[x * 3 + 2];
      obN++;
    }
    for (let x = 0; x < myface.tri_indexes.length / 3; x++) {
      locTriIndices[obTR * 3 + 0] = myface.tri_indexes[x * 3 + 0] + advance - 1;
      locTriIndices[obTR * 3 + 1] = myface.tri_indexes[x * 3 + 1] + advance - 1;
      locTriIndices[obTR * 3 + 2] = myface.tri_indexes[x * 3 + 2] + advance - 1;
      obTR++;
    }

    advance = obP;
  });
  return [locVertexcoord, locNormalcoord, locTriIndices];
}

function objGetTriangle(trianglenum: number, locTriIndices: number[]) {
  const pID = locTriIndices[trianglenum * 3 + 0] * 3;
  const qID = locTriIndices[trianglenum * 3 + 1] * 3;
  const rID = locTriIndices[trianglenum * 3 + 2] * 3;

  const vertices = [pID, qID, rID];
  const normals = [pID, qID, rID];
  const texcoords = [pID, qID, rID];
  return [vertices, normals, texcoords];
}

function generateVertices(
  tot_triangle_count: number,
  locVertexcoord: number[],
  locNormalcoord: number[],
  locTriIndices: number[]
) {
  const vertices: number[] = [];
  function v(x: number, y: number, z: number) {
    vertices.push(...[x, y, z]);
  }
  for (let i = 0; i < tot_triangle_count; i++) {
    const [vertices_idx /*normals_idx*/ /*texcoords_idx*/, ,] = objGetTriangle(
      i,
      locTriIndices
    );
    // first vertex
    v(
      locVertexcoord[vertices_idx[0] + 0],
      locVertexcoord[vertices_idx[0] + 1],
      locVertexcoord[vertices_idx[0] + 2]
    );
    // second vertex
    v(
      locVertexcoord[vertices_idx[1] + 0],
      locVertexcoord[vertices_idx[1] + 1],
      locVertexcoord[vertices_idx[1] + 2]
    );
    // third vertex
    v(
      locVertexcoord[vertices_idx[2] + 0],
      locVertexcoord[vertices_idx[2] + 1],
      locVertexcoord[vertices_idx[2] + 2]
    );
  }
  return vertices;
}

export function getVerticesByShape(shape: TopoDS_Shape) {
  const faceList = getFacesByShape(shape);
  const [locVertexcoord, locNormalcoord, locTriIndices] =
    joinPrimitives(faceList);
  const tot_triangle_count = faceList.reduce(
    (a, b) => a + b.number_of_triangles,
    0
  );
  const vertices = generateVertices(
    tot_triangle_count,
    locVertexcoord,
    locNormalcoord,
    locTriIndices
  );

  return new Float32Array(vertices);
}
