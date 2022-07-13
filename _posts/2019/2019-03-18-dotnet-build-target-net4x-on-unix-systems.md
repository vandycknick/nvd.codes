---
title: How to target net4x on Unix based systems with dotnet build
description: .NET Core and Mono has made it easy for us as developers to run applications on multiple platforms. But targeting multiple runtimes can sometimes still prove to be quite difficult.
date: 2019-03-18T21:00:00+01:00
categories: [dotnet, dotnet core, mono, unix, build]
cover: ./assets/2019-03-18-dotnet-build-target-net4x-on-unix-systems/cover.jpg
---

.NET Core and Mono has made it easy for us as developers to run applications on multiple platforms. But targeting multiple runtimes can sometimes still prove to be quite difficult. On a decent windows dev machine adding a `net4x` moniker should be pretty straightforward but on a unix based system you might run into the following issue:

```
error MSB3644: The reference assemblies for framework ".NETFramework,Version=v4.7.2" were not found.
```

This might look weird given you already have dotnet core installed, but it actually makes a lot of sense and let me explain why. To compile for a certain target framework like `net472` in this case, we need to have the reference assemblies for that framework installed on our machine. A reference assembly is just a standard IL binary but it only contains metadata and no IL code. In other words, it only contains the signatures without the implementation, comparable to a C++ header file. (If you would like to have some more information around reference assemblies have a look at [this video](https://www.youtube.com/watch?v=EBpY1UMHDY8) or [this document](https://github.com/dotnet/standard/blob/0dee41e279fc1dad29dd1e567186e52697b7417a/docs/history/evolution-of-design-time-assemblies.md) from the `dotnet/standard` github repository.) On Windows these are called 'Targeting Packs' which are shipped with Visual Studio or packaged via a standalone installers called 'Developer Packs'.

The problem is that on unix based systems the msbuild that comes pre-bundled with the .NET Core SDK needs to be told where to find those reference assemblies. We can use one of the following 3 methods to help msbuild compile your application:

## 1. Use the reference assemblies from the mono mdk

If you have Visual Studio for Mac or Rider installed, then you probably already have the reference assemblies laid out on disk. If not (like when you prefer to use vscode, ...) you will need to get those assemblies yourself by installing the latest mono-mdk [from here](https://www.mono-project.com/download/stable/)

Depending on your platform those assemblies can be found in one of the following directories:

- `/Library/Frameworks/Mono.framework/Versions/Current/lib/mono` (macos)
- `/usr/lib/mono` (linux)
- `/usr/local/lib/mono` (linux)

To help msbuild find the correct reference assemblies you can simply add a file named `netfx.props` (this can actually be named to whatever you prefer) with the following contents to your project:

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Copyright (c) Microsoft Corporation.  All Rights Reserved.  See License.txt in the project root for license information. -->
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <!-- When compiling .NET SDK 2.0 projects targeting .NET 4.x on Mono using 'dotnet build' you -->
    <!-- have to teach MSBuild where the Mono copy of the reference asssemblies is -->
    <TargetIsMono Condition="$(TargetFramework.StartsWith('net4')) and '$(OS)' == 'Unix'">true</TargetIsMono>

    <!-- Look in the standard install locations -->
    <BaseFrameworkPathOverrideForMono Condition="'$(BaseFrameworkPathOverrideForMono)' == '' AND '$(TargetIsMono)' == 'true' AND EXISTS('/Library/Frameworks/Mono.framework/Versions/Current/lib/mono')">/Library/Frameworks/Mono.framework/Versions/Current/lib/mono</BaseFrameworkPathOverrideForMono>
    <BaseFrameworkPathOverrideForMono Condition="'$(BaseFrameworkPathOverrideForMono)' == '' AND '$(TargetIsMono)' == 'true' AND EXISTS('/usr/lib/mono')">/usr/lib/mono</BaseFrameworkPathOverrideForMono>
    <BaseFrameworkPathOverrideForMono Condition="'$(BaseFrameworkPathOverrideForMono)' == '' AND '$(TargetIsMono)' == 'true' AND EXISTS('/usr/local/lib/mono')">/usr/local/lib/mono</BaseFrameworkPathOverrideForMono>

    <!-- If we found Mono reference assemblies, then use them -->
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net45'">$(BaseFrameworkPathOverrideForMono)/4.5-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net451'">$(BaseFrameworkPathOverrideForMono)/4.5.1-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net452'">$(BaseFrameworkPathOverrideForMono)/4.5.2-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net46'">$(BaseFrameworkPathOverrideForMono)/4.6-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net461'">$(BaseFrameworkPathOverrideForMono)/4.6.1-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net462'">$(BaseFrameworkPathOverrideForMono)/4.6.2-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net47'">$(BaseFrameworkPathOverrideForMono)/4.7-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net471'">$(BaseFrameworkPathOverrideForMono)/4.7.1-api</FrameworkPathOverride>
    <FrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != '' AND '$(TargetFramework)' == 'net472'">$(BaseFrameworkPathOverrideForMono)/4.7.2-api</FrameworkPathOverride>
    <EnableFrameworkPathOverride Condition="'$(BaseFrameworkPathOverrideForMono)' != ''">true</EnableFrameworkPathOverride>

    <!-- Add the Facades directory.  Not sure how else to do this. Necessary at least for .NET 4.5 -->
    <AssemblySearchPaths Condition="'$(BaseFrameworkPathOverrideForMono)' != ''">$(FrameworkPathOverride)/Facades;$(AssemblySearchPaths)</AssemblySearchPaths>
  </PropertyGroup>

  <ItemGroup Condition="'$(TargetFramework)'== 'net472'">
    <Reference Include="netstandard" />
  </ItemGroup>
</Project>
```

Than you can just import this into your project as follows:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <Import Project="netfx.props" />
  <PropertyGroup>
    <Description>...
```

And now you are good to go! You can find an example of this in the fsharp [repo](https://github.com/Microsoft/visualfsharp/blob/91bdb8a8e07f205300d9f7af14969dd9344f6c61/fcs/netfx.props).

## 2. Get your reference assemblies from the dotnet-core MyGet feed

An alternative approach that doesn't require having mono installed is to obtain them via nuget, however, they are not available on nuget.org as of today, there is [a GitHub issue](https://github.com/dotnet/designs/pull/33) that can be tracked regarding this. They currently exist on a[ MyGet feed](https://dotnet.myget.org/gallery/dotnet-core) (from version 4.5 and up) and are official Microsoft packages. You can get a list of all available targeting frameworks by typing `TargetingPack.NETFramework` into the search box.

First you need to add the feed like this:

```xml
<PropertyGroup>
  <TargetFrameworks>net472;netcoreapp2.1</TargetFrameworks>
  <RestoreAdditionalProjectSources>
    https://dotnet.myget.org/F/dotnet-core/api/v3/index.json
  </RestoreAdditionalProjectSources>
</PropertyGroup>
```

This is similar to adding a new feed into your `nuget.config` so pick whatever method you prefer. You can also use the `RestoreSources` property and append it to the existing source like this `<RestoreSources>$(RestoreSources);...</RestoreSources>` . More information can be found [here](https://github.com/NuGet/Home/wiki/%5BSpec%5D-NuGet-settings-in-MSBuild#project-properties).

Now we can import the package:

```xml
<ItemGroup Condition=" '$(TargetFramework)' == 'net472' ">
  <PackageReference Include="Microsoft.TargetingPack.NETFramework.v4.7.2" Version="1.0.0" ExcludeAssets="All" PrivateAssets="All" />
</ItemGroup>
```

Finally, we need to point the `FrameworkPathOverride` to the assemblies from this package:

```xml
<PropertyGroup Condition="'$(TargetFramework)'== 'net72'">
  <FrameworkPathOverride>$(NuGetPackageRoot)microsoft.targetingpack.netframework.v4.7.2/1.0.0/lib/net472/</FrameworkPathOverride>
</PropertyGroup>
```

## 3. Use the Microsoft.NETFramework.ReferenceAssemblies package from nuget

Another way of doing this is by adding a reference to the `Microsoft.NETFramework.ReferenceAssemblies` from [nuget](https://www.nuget.org/packages/Microsoft.NETFramework.ReferenceAssemblies/). Personally this is my preferred method, because it is a simple, straightforward single include that does all the heavy lifting for you. Just add the following line to your `csproj` or `Directory.build.props`:

```xml
<PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies" Version="1.0.0">
  <PrivateAssets>all</PrivateAssets>
  <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
</PackageReference>
```

### Conclusion

Doing multi runtime and cross-platform .NET development is not always as easy as it should be. You need to make sure you have the right reference assemblies laid out on disk or know what magic keywords to add in your csproj file. Alternatively it's always possible to use `msbuild` that's shipped with mono directly and it will make sure you have the right references setup. But for some people (me included) this breaks their flow and prefer to use one command to rule them all. These are the tricks I came up with to overcome this issue, let me know if you have other ways of approaching this in the comments below.
