<h1 align="center">
Movement Detection Core
</h1>

<h6 align="center">
This is the movement detection core app for a serious game project. 
<br />
<a href="https://interaction-hazel.vercel.app/fitness">View Demo</a>
·
<a href="https://github.com/cy-moi/TfjsBoilerPlate/issues">Report Bug</a>

</h6>

---

<br />
Collect data and train model online

<img src="../../assets/imgs/collectpage.png"/>

Try out page  

<img src="../../assets/imgs/trypage.jpg"/>


# How to run

**Node version: 16.xx.x is required**

1. Clone the repository

```bash
$ git clone
```

2. Install dependencies

```bash
$ yarn install --frozen-lockfile
```

3. Build the project

```bash
$ yarn build
```

4. Run the project locally

```bash
$ yarn start
```

Refer to `package.json` and `yarn.lock` if any pacakge version conflicts happen. Remove `yarn.lock` file if you are not using `yarn`.

# Develop

- `master` is the stable production branch.
- `dev` branch has the most recent changes.
- Branch naming: `[branch from]-[feature]`, e.g., `dev-dnd` is branched from `dev` for `drag-n-drop` features. This rule can be chained.

# TODO

1. Add another layer of shape creation APIs which will create corresponding polygons.
2. ✅ Add weapon/defense slot properties to static shape: another class of shapes inherented from the basic shapes. The MobileShape class will inherent this class.
3. Add boudaries to the creation sesssion
4. ✅ Fix the viewport, limit the movement with boundaries
5. ✅ Procedural generation of enemies - need to fix some obstacles textures to make it looks better
6. ☑️ The ui of vessel creation

# Bucket

1. Arrows for weapons
2. Arrow damage depends on color
3. Drag and drop should be handeled by pixi

# References

[Pixi boilerplate](https://github.com/dopamine-lab/pixi-boilerplate).
