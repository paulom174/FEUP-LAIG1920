var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.key =0;


        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
                return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                    this.onXMLMinorError("tag <animations> out of order");
    
        //Parse animations block
        if ((error = this.parseAnimations(nodes[index])) != null)
                    return error;
            }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.onXMLMinorError("To do: Parse views and create cameras.");
        var children = viewsNode.children;
        this.views = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        //Any number of cameras.
        for (var i = 0; i < children.length; i++) {

            //Check type of camera
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(children[i].nodeName == "perspective"){

                //Get id of the current camera.
                var cameraId = this.reader.getString(children[i], 'id');
                if (cameraId == null)
                    return "no ID defined for camera";
    
                //Checks for repeated IDs.
                if (this.views[cameraId] != null)
                    return "ID must be unique for each camera (conflict: ID = " + lightId + ")";
    

                var near = this.reader.getFloat(children[i], 'near');
                if (near == null)
                    return "no near defined for camera";

                var far = this.reader.getFloat(children[i], 'far');
                if (far == null)
                    return "no far defined for camera";

                var angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null)
                    return "no angle defined for camera";



                grandChildren = children[i].children;
                //Specifications for the current camera.
                for (var j = 0; j < grandChildren.length; j++){

                    if (grandChildren[j].nodeName != "from" && grandChildren[j].nodeName != "to") {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }
                    if(grandChildren[j].nodeName == "from"){
                        var x1 = this.reader.getFloat(grandChildren[j], 'x');
                        var y1 = this.reader.getFloat(grandChildren[j], 'y');
                        var z1 = this.reader.getFloat(grandChildren[j], 'z');
                    }
                    else{
                        var x2 = this.reader.getFloat(grandChildren[j], 'x');
                        var y2 = this.reader.getFloat(grandChildren[j], 'y');
                        var z2 = this.reader.getFloat(grandChildren[j], 'z');
                    }
                }

            
            var camera = new CGFcamera(angle * DEGREE_TO_RAD, near, far, [x1,y1,z1], [x2,y2,z2]);
            this.views.push([cameraId, camera]);
            }
            else{
                //Get id of the current camera.
                var cameraId = this.reader.getString(children[i], 'id');
                if (cameraId == null)
                    return "no ID defined for camera";
    
                //Checks for repeated IDs.
                if (this.views[cameraId] != null)
                    return "ID must be unique for each camera (conflict: ID = " + lightId + ")";
    

                var near = this.reader.getFloat(children[i], 'near');
                if (near == null)
                    return "no near defined for camera";

                var far = this.reader.getFloat(children[i], 'far');
                if (far == null)
                    return "no far defined for camera";

                var left = this.reader.getFloat(children[i], 'left');
                if (left == null)
                    return "no left defined for camera";

                var right = this.reader.getFloat(children[i], 'right');
                    if (right == null)
                        return "no right defined for camera";

                var top = this.reader.getFloat(children[i], 'top');
                    if (top == null)
                        return "no top defined for camera";   
        
                var bottom = this.reader.getFloat(children[i], 'bottom');
                    if (bottom == null)
                        return "no bottom defined for camera";
                
                grandChildren = children[i].children;

                //Specifications for the current camera.
                for(var h=0; h < grandChildren.length; h++){

                    if (grandChildren[h].nodeName != "from" && grandChildren[h].nodeName != "to" && grandChildren[h].nodeName != "up") {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }
                    if(grandChildren[h].nodeName == "from"){
                        var x1 = this.reader.getFloat(grandChildren[h], 'x');
                        var y1 = this.reader.getFloat(grandChildren[h], 'y');
                        var z1 = this.reader.getFloat(grandChildren[h], 'z');
                    }
                    else if(grandChildren[h].nodeName == "to"){
                        var x2 = this.reader.getFloat(grandChildren[h], 'x');
                        var y2 = this.reader.getFloat(grandChildren[h], 'y');
                        var z2 = this.reader.getFloat(grandChildren[h], 'z');
                    }
                    else{
                        var x3 = this.reader.getFloat(grandChildren[h], 'x');
                        var y3 = this.reader.getFloat(grandChildren[h], 'y');
                        var z3 = this.reader.getFloat(grandChildren[h], 'z');
                    }
                }

            var camera = new CGFcameraOrtho(left, right, bottom, top, near, far, [x1,y1,z1], [x2,y2,z2], [x3,y3,z3]);
            this.views.push([cameraId ,camera]);
            }

        }

        console.log(this.views[0]);
        console.log(this.views[1]);
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }



                var attributeIndex = nodeNames.indexOf("attenuation");

                console.log(attributeIndex);

                if(attributeIndex == -1){
                    return "Tag attenuation is missing from light" + lightId;
                }
                var aux = this.reader.getFloat(grandChildren[attributeIndex], 'constant');       
                global.push(aux);    
                var aux = this.reader.getFloat(grandChildren[attributeIndex], 'linear');           
                global.push(aux);           
                var aux = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                global.push(aux);


            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    changeViews(){
        var camera = this.views[this.selectedView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL

        this.textures = [];

        var children = texturesNode.children;


        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            //Get file name
            var path = this.reader.getString(children[i], 'file');
            if (path == null)
                return "no path defined for file";

            var text = new CGFtexture(this.scene, "./" + path);

            this.textures[textureId] = text;

        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null)
                return "no shininess defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;

            


            // Validate the material type
            if (grandChildren.length != 4 ||
                (grandChildren[0].nodeName != 'emission' && grandChildren[0].nodeName != 'ambient' &&
                    grandChildren[0].nodeName != 'difuse' && grandChildren[0].nodeName != 'specular')) {
                return "There must be exactly 4 primitive type (emission, ambient, difuse and specular)";
            }

            var mat = new CGFappearance(this.scene);
            mat.setShininess(shininess);

            for (var h=0; h < grandChildren.length; h++){

            
            var materialType = grandChildren[h].nodeName;
            var r, g, b, a;

            if (materialType == 'emission') {
                // R
                r = this.reader.getFloat(grandChildren[0], 'r');
                if (!(r != null && !isNaN(r)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // G
                g = this.reader.getFloat(grandChildren[0], 'g');
                if (!(g != null && !isNaN(g)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // B
                b = this.reader.getFloat(grandChildren[0], 'b');
                if (!(b != null && !isNaN(b)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // A
                a = this.reader.getFloat(grandChildren[0], 'a');
                if (!(a != null && !isNaN(a)))
                    return "unable to parse r of RGB for ID = " + materialID;
                mat.setEmission(r, g, b, a);
            }
            else if (materialType == 'ambient') {
                // R
                r = this.reader.getFloat(grandChildren[1], 'r');
                if (!(r != null && !isNaN(r)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // G
                g = this.reader.getFloat(grandChildren[1], 'g');
                if (!(g != null && !isNaN(g)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // B
                b = this.reader.getFloat(grandChildren[1], 'b');
                if (!(b != null && !isNaN(b)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // A
                a = this.reader.getFloat(grandChildren[1], 'a');
                if (!(a != null && !isNaN(a)))
                    return "unable to parse r of RGB for ID = " + materialID;
                mat.setAmbient(r, g, b, a);
            }
            else if (materialType == 'diffuse') {
                // R
                r = this.reader.getFloat(grandChildren[2], 'r');
                if (!(r != null && !isNaN(r)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // G
                g = this.reader.getFloat(grandChildren[2], 'g');
                if (!(g != null && !isNaN(g)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // B
                b = this.reader.getFloat(grandChildren[2], 'b');
                if (!(b != null && !isNaN(b)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // A
                a = this.reader.getFloat(grandChildren[2], 'a');
                if (!(a != null && !isNaN(a)))
                    return "unable to parse r of RGB for ID = " + materialID;
                mat.setDiffuse(r, g, b, a);
            }
            else {
                // R
                r = this.reader.getFloat(grandChildren[3], 'r');
                if (!(r != null && !isNaN(r)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // G
                g = this.reader.getFloat(grandChildren[3], 'g');
                if (!(g != null && !isNaN(g)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // B
                b = this.reader.getFloat(grandChildren[3], 'b');
                if (!(b != null && !isNaN(b)))
                    return "unable to parse r of RGB for ID = " + materialID;
                // A
                a = this.reader.getFloat(grandChildren[3], 'a');
                if (!(a != null && !isNaN(a)))
                    return "unable to parse r of RGB for ID = " + materialID;
                mat.setSpecular(r, g, b, a);
            }
        }

            this.materials[materialID] = mat;
            
        }


        //this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();
            

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        /*var coordinates = this.parseRotation(grandChildren[j], "translate transformation for ID " + transformationID);
                        var axis = coordinates[0];
                        var angle = coordinates[1];
                        */
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getString(grandChildren[j], 'angle');
                        angle *=DEGREE_TO_RAD;
                        

                        if (axis == 'x')
                            //var vec = new vec3(1, 0, 0);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [1,0,0]);

                        if (axis == 'y')
                            //var vec = new vec3(0, 1, 0);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [0,1,0]);

                        if (axis == 'z')
                            //var vec = new vec3(0, 0, 1);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [0,0,1]);


                        //transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, vec);


                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

/**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];
        this.animationsID = [];
        
        var animation = [];
        var keyframes =[];

        var grandChildren = [];


        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animations";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animations (conflict: ID = " + animationsId + ")";

            grandChildren = children[i].children;
            var grandgrandChildren;
            var initial = new MyKeyFrame(this.scene, 0, [0,0,0], [1,1,1], [0,0,0]);
            keyframes.push(initial);
            for(var i=0; i < grandChildren.length;i++)
            {
                var keyframe = [];
                var keyframeInstant = this.reader.getFloat(grandChildren[i], 'instant');
                grandgrandChildren = grandChildren[i].children;

                for(var j=0; j < grandgrandChildren.length; j++){
                    switch (grandgrandChildren[j].nodeName) {
                        case 'translate':
                            var translation = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for ID " + animationId);
                            if (!Array.isArray(translation))
                                return translation;
    
                            break;
                        case 'scale':
                            var scaling = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for ID " + animationId);
                            if (!Array.isArray(scaling))
                                return scaling;
    
                            break;
                        case 'rotate':
                            var angle_x = this.reader.getFloat(grandgrandChildren[j], 'angle_x');
                            var angle_y = this.reader.getFloat(grandgrandChildren[j], 'angle_y');
                            var angle_z = this.reader.getFloat(grandgrandChildren[j], 'angle_z');

                            angle_x *=DEGREE_TO_RAD;
                            angle_y *=DEGREE_TO_RAD;
                            angle_z *=DEGREE_TO_RAD;

                            var rotation = [angle_x, angle_y, angle_z];
                            break;
                    }
                }

                var keyframe = new MyKeyFrame(this.scene, keyframeInstant, translation, scaling, rotation);
                keyframes.push(keyframe);
            
            }
            var animation = new MyAnimation(this.scene, animationId, keyframes);
            this.animationsID.push(animationId);
            this.animations[animationId] = animation;
        }
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' && grandChildren[0].nodeName != 'patch')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, plane or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if(primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;


                var triang = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = triang;
            }
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


                var sphe = new MySemiSphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphe;
            }
            else if (primitiveType == 'cylinder') {
                // baseRadius
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse baseRadius of the primitive coordinates for ID = " + primitiveId;

                // topRadius
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse topRadius of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


                var cylind = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylind;
            }
            else if (primitiveType == 'torus') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;
                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, slices, stacks, outer, inner);

                this.primitives[primitiveId] = torus;
            }

            else if (primitiveType == 'plane') {
                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var plane = new MyPlane(this.scene, primitiveId, npartsU, npartsV);

                this.primitives[primitiveId] = plane;

            }

            else if (primitiveType == 'patch') {
                // npointsU
                var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                // npointsV
                var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var npoints = (npointsU+1) * (npointsV+1);
                var U = [];
                var V = [];
                var cpoints =[];

                for(var j=0; j < npoints; j++){
                    var pointX = this.reader.getFloat(grandChildren[0].children[j], 'xx');
                    if (!(pointX != null && !isNaN(pointX)))
                        return "unable to parse pointX of the primitive coordinates for ID = " + primitiveId;

                    var pointY = this.reader.getFloat(grandChildren[0].children[j], 'yy');
                    if (!(pointY != null && !isNaN(pointY)))
                        return "unable to parse pointY of the primitive coordinates for ID = " + primitiveId;

                    var pointZ = this.reader.getFloat(grandChildren[0].children[j], 'zz');
                    if (!(pointZ != null && !isNaN(pointZ)))
                        return "unable to parse pointZ of the primitive coordinates for ID = " + primitiveId;

                    cpoints.push([pointX,pointY,pointZ, 1]);
                }

                console.log(cpoints.length); 
                for(var j=0;j<cpoints.length;j++)
                {
                    V.push(cpoints[j]);
                    if((j+1)%(npointsV+1) == 0)
                    {
                        U.push(V);
                        V = [];
                    }
                }
                // cpoints = [];
                // cpoints.push(U);
                var patch = new MyPatch(this.scene, primitiveId, npointsU, npointsV, npartsU, npartsV, U);

                this.primitives[primitiveId] = patch;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];
        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            var component = [];
            var child = [];
            var primitive = [];

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            component.id = componentID;

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            grandgrandChildren = grandChildren[transformationIndex].children;

            var matrix = mat4.create();
            this.transformations[component.id] = matrix;

            for (var h = 0; h < grandgrandChildren.length; h++) {
                if (grandgrandChildren[h].nodeName != "transformationref" && grandgrandChildren[h].nodeName != "translate"
                    && grandgrandChildren[h].nodeName != "scale" && grandgrandChildren[h].nodeName != "rotate") {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[h].nodeName + ">");
                    continue;
                }
                if (grandgrandChildren[h].nodeName == "transformationref") {
                    var transformationId = this.reader.getString(grandgrandChildren[h], "id");
                    component.transformation = transformationId;
                }
                else {
                    this.transform(grandChildren[transformationIndex], componentID);
                }
            }

            // Animation
            var animations = [];
            var no;

            if(animationIndex != -1){

                no = grandChildren[animationIndex];
                if (no.nodeName != "animationref") {
                this.onXMLMinorError("unknown tag <" + no.nodeName + ">");
                continue;
                }
                var animationId = this.reader.getString(no, "id");

                animations.push(animationId);
                component.animation = animations;

                if(component.animation != null){
                    this.animations[component.animation].startAnimation();
                }
            }

            // Materials

            var materials = [];
            grandgrandChildren = grandChildren[materialsIndex].children;

            for (var p = 0; p < grandgrandChildren.length; p++) {
                if (grandgrandChildren[p].nodeName != "material") {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[p].nodeName + ">");
                    continue;
                }
                var materialId = this.reader.getString(grandgrandChildren[p], "id");
                materials.push(materialId);
            }

            component.material = materials;


            // Texture
            var texturas = [];
            var textureId = this.reader.getString(grandChildren[textureIndex], "id");
            var s = this.reader.getFloat(grandChildren[textureIndex], "length_s");
            var t = this.reader.getFloat(grandChildren[textureIndex], "length_t");

            texturas[0] = textureId;
            texturas[1] = s;
            texturas[2] = t;

            component.texture = texturas;



            // Children
            grandgrandChildren = grandChildren[childrenIndex].children;
            for (var m = 0; m < grandgrandChildren.length; m++) {
                if (grandgrandChildren[m].nodeName == "primitiveref")
                    primitive.push(this.reader.getString(grandgrandChildren[m], "id"));
                else if (grandgrandChildren[m].nodeName == "componentref") {
                    child.push(this.reader.getString(grandgrandChildren[m], "id"));
                }
                else {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[m].nodeName + ">");
                }
            }
            component.primitive = primitive;
            component.child = child;
            this.components[componentID] = component;
        }
    }

    updateAnimation(dif){

        this.animationsID.forEach(element => {

            this.animations[element].update(dif);
        });
        // for(var i=0; i < this.animationsID.length; i++){
        //     this.animations[this.animationsID[i]].update(dif);
        // }
    }


    transform(tranformationsNode, componentID){

        var finalMatrix = mat4.create();
        var transfNode;

        for (var i = 0; i < tranformationsNode.children.length; i++){
            transfNode = tranformationsNode.children[i];
            var transfMatrix = mat4.create();


                switch (transfNode.nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(transfNode, "translate transformation for ID " + transfNode.nodeName);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(transfNode, "translate transformation for ID " + transfNode.nodeName);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        /*var coordinates = this.parseRotation(transfNode, "translate transformation for ID " + transformationID);
                        var axis = coordinates[0];
                        var angle = coordinates[1];
                        */
                        var axis = this.reader.getString(transfNode, 'axis');
                        var angle = this.reader.getString(transfNode, 'angle');
                        angle *= DEGREE_TO_RAD;

                        if (axis == 'x')
                            //var vec = new vec3(1, 0, 0);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [1, 0, 0]);

                        if (axis == 'y')
                            //var vec = new vec3(0, 1, 0);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [0, 1, 0]);

                        if (axis == 'z')
                            //var vec = new vec3(0, 0, 1);
                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, [0, 0, 1]);


                        //transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, vec);


                        break;
                }
            mat4.multiply(finalMatrix, finalMatrix, transfMatrix);
        }

        
        this.transformations[componentID] = finalMatrix;
    }
    


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    parseRotation(node, messageError) {
        var position = [];

        // axis
        var axis = this.reader.getString(node, 'axis');
        if (!(axis != null && !isNaN(axis)))
            return "unable to parse axis of the " + messageError;

        // angle
        var angle = this.reader.getFloat(node, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of the " + messageError;

        position.push(...[axis, angle, 0]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    displayComponent(component, parentmat, parenttext) {

        var mat;
        var text;
        var i = this.key % component.material.length;


        if(component.material[i] == "inherit"){
            mat = parentmat;
        }
        else{

            mat = this.materials[component.material[i]];
        }

        if(component.texture[0] == "inherit"){
            text = parenttext;
        }
        else if(component.texture[0] == "none"){
            text = null;
        }
        else{
            text = this.textures[component.texture[0]];
        }



        if (component.primitive.length != 0) {
            for (var i = 0; i < component.primitive.length; i++) {

                this.scene.pushMatrix();
                var transID = this.transformations[component.id];
                this.scene.multMatrix(transID);
                if(component.animation != null){
                    this.animations[component.animation].apply();
                }
                var primitiveID = component.primitive[i];

                mat.setTexture(text);
                mat.apply();

                this.primitives[primitiveID].updateTexCoords(component.texture[1], component.texture[2]);

                mat.setTextureWrap('REPEAT', 'REPEAT');

                this.primitives[primitiveID].display();
                this.scene.popMatrix();
                    
                }
            }
            
            
            if (component.child.length != 0) {
                for (var i = 0; i < component.child.length; i++) {
                    
                    this.scene.pushMatrix();
                    var transID = this.transformations[component.id];
                    this.scene.multMatrix(transID);
                    if (component.animation != null) {
                        this.animations[component.animation].apply();
                    }
                    this.displayComponent(this.components[component.child[i]], mat, text);
                    this.scene.popMatrix();
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph

        //To test the parsing/creation of the primitives, call the display function directly
        //this.primitives['demoRectangle'].display();
        //this.primitives['demoTriangle'].display();
        //this.primitives['demoCylinder'].display();
        //this.primitives['demoSphere'].display();
        //this.primitives['demoTorus'].display();
        //this.primitives['demoTriangle'].display();

        //this.primitives['demoPatch'].display();

        this.displayComponent(this.components[this.idRoot], null, null);

    }
}