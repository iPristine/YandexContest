const fs = require("fs");
let fileContent = fs.readFileSync("input.json", "utf8");

const obj = JSON.parse(fileContent);

const result = autopilot(obj);

fs.writeFileSync("output2.json", JSON.stringify(result));

function autopilot({ routeTree, data, urls }) {
 return  urls.map((url) => {
    rawRoutes = createRawRoutesByUrl(url);
    rawNodes = rawRoutes.map(rawRoute=>getNode(rawRoute, routeTree, [])) 
    nodesWithRedirects = rawNodes.map(node=>{
      if(node.node.redirectTo){
        newRoute = [...node.routeArray.slice(0, node.routeArray.length-1), node.node.redirectTo]
        return getNode(newRoute, routeTree, [])
      }
      return node
    })
     nodesWithData=nodesWithRedirects.map(node=>{
      if(node.node.route.includes(":")){
        let key = node.node.route.replace(":","").replace("Id","")
        title = data[key][node.routeArray[node.routeArray.length-1]]
        return {route: createRoute(node.routeArray), title}
      }
      return {route: createRoute(node.routeArray), title: node.title}
    })
    return nodesWithData
  });
}

function createRawRoutesByUrl(url) {
  const path = url.split("/");

  const pathNodes = path.map((item) => {
    let routeToFind = item !== "" ? item : "/";
    return routeToFind;
  });
  let   acc = []
  const rawRoutes = pathNodes.map((item, index) => {
    acc.push(item)

    return [...acc]
  })

  return rawRoutes;
}

function getNode(rawRoute, tree, paths) {
  const [path, ...restPath] = rawRoute;
  if (restPath.length === 0) {

    return {
      routeArray: [...paths, path],
      title: tree.title,
      node: tree,
    };
  }
  nextPath = restPath[0];
  isNextPathNumber = !isNaN(nextPath);
  let child;
  if (isNextPathNumber) {
    child = tree.children.find((child) => child.route.includes(":"));
  } else {
    child = tree.children.find((child) => child.route === nextPath);
  }

  return getNode(restPath, child, [...paths, path])

}

function createRoute(routArr){
  return '/'+routArr.slice(1).join("/")
}


